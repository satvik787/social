'use client';
import style from './friends.module.css';
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useFormState} from "react-dom";
import friendRequest, {acceptRequest, deleteRequest} from "@/actions/friendRequest";
import {user} from "@/db/schema";
import {acceptChannelRequest} from "@/actions/channel.js";
import {socket} from "@/socket.js";
import {CHANNEL, dispatch, FRIENDS} from "@/app/Components/Store.js";
function FriendItem({val,firstIcon,secondIcon,firstHandler,secondHandler}){
    return (
        <div >
            <hr style={{margin:"0 auto",width:"96%"}}/>
            <div className={style.friend}>
                <div className={style.friend_info}>
                    <div className={style.friend_img_wrapper}>
                        <img width={"32px"} height={"32px"} src={val.img || "/discord-mark-white.svg"} className={style.friend_img}/>
                    </div>
                    <div className={style.friend_name}>
                        {
                            val.channel === undefined &&
                            <>
                                <h4>{val.username}</h4>
                                <p>{val.status}</p>
                            </>
                        }
                        {
                            val.channel &&
                            <h3 style={{color: "whitesmoke",fontWeight:"400"}}> @<b>{val.username}</b> wants you to join<h3>{val.channel}</h3></h3>
                        }
                    </div>
                </div>
                <div >
                    {firstIcon !== null && <button className={style.options}  onClick={firstHandler}><FontAwesomeIcon icon={firstIcon}/></button>}
                    {secondIcon !== null && <button className={style.options} onClick={secondHandler}><FontAwesomeIcon icon={secondIcon}/></button>}
                </div>
            </div>
        </div>
    );
}



export default function Friends({uid,username,channelRequest,pendingRequest,allFriends,friendsInvites}) {
    const [data, setData] = useState([allFriends,pendingRequest,friendsInvites]);
    const [formState,formAction] = useFormState(friendRequest,null);
    const [statusFilter, setStatusFilter] = useState(user.status.enumValues[0]);
    const [visibility, setVisibility] = useState([true,false,false,false]);
    const [memberRequest,setMemberRequest] = useState(channelRequest);
    const searchFriend = useRef();


    useEffect(() => {
        if(formState && formState.ok){
            searchFriend.current.value = "";
            socket.emit("friend:invite",{to:formState.data.uid,username,uid,status:"online"});
            setData(prevState => [prevState[0],[formState.data,...prevState[1]],prevState[2]]);
        }
    }, [formState, searchFriend, uid, username]);

    useEffect(() => {
        socket.emit("ping",{
            uid:uid,
            username:username
        });
        const cancelId = setInterval(()=>{
            socket.emit("ping",{
                uid:uid,
                username:username
            });
        },1200000);
        return ()=>{
            clearInterval(cancelId);
        }
    }, [uid, username]);

    useEffect(() => {
        socket.on("channel:gotInvite",(val)=>{
            let {cid,to,channel,username,ciid} = val;
            cid = Number(cid);
            to = Number(to);
            ciid = Number(ciid);

            setMemberRequest((prev)=>[...prev,{cid,to,ciid,channel,username}]);
        });
        socket.on("friend:gotInvite",(val)=>{
           let {uid,username,status} = val;
           uid = Number(uid);
           setData(prevState => [prevState[0],prevState[1],[...prevState[2],{uid,username,status}]])
        });
        return ()=>{
            socket.removeAllListeners("channel:gotInvite");
            socket.removeAllListeners("friend:gotInvite");
        }
    }, []);

    const handleClick = (ind,event)=>{
        setVisibility(prevState=> prevState.map((val,i) => i === ind));
        setStatusFilter(event.target.innerText.toLowerCase());
    }

    const handleAcceptRequest = async (event,val,ind)=>{
        const res = await acceptRequest(val.uid,uid);
        if(res.ok){
            dispatch(FRIENDS,{fid:res.fid,username:val.username});
            setData(prevState => [[val, ...prevState[0]],prevState[1],prevState[2].filter((v,i)=>i !== ind)]);
        }else{
            console.log("Failed to complete friend Request");
        }
    }

    const handleAcceptChannelRequest = async (val)=>{
        const res = await acceptChannelRequest({ciid:val.ciid,uid:val.to,cid:val.cid});
        if(res.ok){
            dispatch(CHANNEL,{cid:val.cid,name:val.channel,channel_banner:"/discord-logo-white.svg"})
            setMemberRequest((prev)=> prev.filter((el) => el !== val));
        }else{
            console.log("Failed to complete friend Request",res);
        }
    }

    const handleCancelRequest = async (event,val,stateInd,itemInd,from,to)=>{
        const res = await deleteRequest(from,to);
        if(res.ok){
            setData(prevState => {
                return prevState.map((v,i)=>{
                    if(i === stateInd){
                        return v.filter((_,j) => j !== itemInd);
                    }
                    return v;
                });
            });
        }else{
            console.log("Failed to complete friend Request");
        }
    }




    return (
        <div className={style.box}>
            <nav className={style.navbar}>
                <div>
                    <button className={style.status_btn}
                            onClick={(e)=>handleClick(0,e)}
                            style={{backgroundColor:statusFilter === "online" ? "#212020":"#2c2c2d"}} >
                        Online
                    </button>
                    <button className={style.status_btn}
                            onClick={(e)=>handleClick(0,e)}
                            style={{backgroundColor:statusFilter === "all" ? "#212020":"#2c2c2d"}}>
                        All</button>
                    <button className={style.status_btn}
                            onClick={(e)=>handleClick(1,e)}
                            style={{backgroundColor:statusFilter === "pending" ? "#212020":"#2c2c2d"}}>
                        Pending
                    </button>
                    <button
                        onClick={(e)=>handleClick(2,e)}
                        className={style.add_friend_btn} >
                        Add Friend
                    </button>
                </div>
                <div>
                    <button
                        onClick={(e)=>handleClick(3,e)}
                        className={style.status_btn} >
                        Invites
                    </button>
                </div>
            </nav>
            <input  type={"text"} className={style.search_box} placeholder={"Search Friends"} style={{display:statusFilter === "all" && visibility[0] ? "block" : "none"}}/>

            {
                visibility[0] &&
                <div className={style.friends_list}>
                    {
                        data[0].filter((val)=>val.status === statusFilter || statusFilter === "all").map((val)=>(
                            <FriendItem val={val} key={val.uid} firstIcon={faComment} secondIcon={faEllipsisVertical}/>
                        ))
                    }
                </div>
            }
            {
                visibility[1] &&
                <div className={style.friends_list}>
                    {
                        data[1].map((val,ind)=>(
                            <FriendItem
                                val={val}
                                key={val.uid}
                                firstIcon={null}
                                secondIcon={faXmark}
                                secondHandler={(e) => handleCancelRequest(e,val,1,ind,uid,val.uid)}
                            />
                        ))
                    }
                </div>
            }
            {
                visibility[2] &&
                <>
                    <div className={style.req_info}>
                        <h3>Add Friend</h3>
                        <p>you can add friends with their discord username</p>
                    </div>
                    <form action={formAction} className={style.add_friend} >
                        <input name={"username"} ref={searchFriend} className={style.add_friend_input} autoComplete={"off"}/>
                        <button className={style.add_friend_submit}>Send Friend Request</button>
                    </form>
                    <div className={style.info} >
                        {formState !== null  && formState.msg.username !== undefined && <span >{formState.msg.username}</span>}
                    </div>
                </>
            }
            {
                visibility[3] &&
                <div className={style.friends_list}>
                    {
                        data[2].map((val,ind)=>(
                            <FriendItem val={val}
                                        key={val.uid}
                                        firstIcon={faCheck}
                                        secondIcon={faXmark}
                                        firstHandler={(e)=> handleAcceptRequest(e,val,ind)}
                                        secondHandler={(e) => handleCancelRequest(e,val,2,ind,val.uid,uid)}
                            />
                        ))
                    }
                    {
                        memberRequest.length > 0 &&
                        <div>
                            <h4 style={{color: "whitesmoke", margin: "8px 20px"}}>Channel Invites</h4>
                            {
                                memberRequest.map((val, ind) => (
                                    <FriendItem val={val}
                                                key={ind}
                                                firstIcon={faCheck}
                                                secondIcon={faXmark}
                                                firstHandler={() => handleAcceptChannelRequest(val)}
                                                secondHandler={(e) => true}
                                    />
                                ))
                            }
                        </div>

                    }
                </div>
            }
        </div>
    );
}