'use client';
import style from "./page.module.css";
import ChatBox from "@/app/channels/Components/ChatBox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faHashtag, faXmark} from "@fortawesome/free-solid-svg-icons";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import {faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import UserBox from "@/app/channels/Components/UserBox";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {inviteMember} from "@/actions/channel.js";
import {useFormState} from "react-dom";
import {socket} from "@/socket.js";

export default function ChannelPage({messages=[],cid,user,members}) {
    const queryParams = useSearchParams();
    const [dropdown, setDropdown] = useState(false);
    const [formState,action] = useFormState(inviteMember,null);

    useEffect(()=>{
        if(formState  && formState.ok){
            socket.emit("channel:invite",{channel:queryParams.get("name"),cid,username:user.username,ciid:formState.ciid,to:formState.to});
            setDropdown(false);
        }
    },[cid, formState, queryParams, user.username])

    return (
        <>
            {
                dropdown &&
                <form className={style.add_sub_channel_model} action={action}>
                    <h2 className={style.sub_channel_title}>Invite A friend To Join !</h2>
                    <input className={style.sub_channel_input} min={5} required type={"text"} placeholder={"@username"}
                           name={"username"}/>
                    {
                        formState && !formState.ok &&
                        <span style={{color:"red",fontSize:"14px",marginLeft:"16px"}}>{formState.msg.username || formState.msg}</span>
                    }
                    <input style={{display: "none"}} name={"cid"} value={cid}/>
                    <input style={{display: "none"}} name={"from"} value={user["id"]}/>
                    <button className={style.sub_channel_btn}>Send invite</button>
                </form>
            }
            <div className={style.main_box}>
                <div className={style.sub_channels}>
                    <div style={{height:"90.5%",overflowY:"scroll"}}>
                        <nav className={style.navbar}>
                            <p># {queryParams.get("name")}</p>
                            <FontAwesomeIcon icon={dropdown ? faXmark : faAngleDown}
                                             onClick={() => setDropdown((prevState) => !prevState)}/>
                        </nav>
                        <div className={style.channels_wrapper}>
                            <div className={style.direct_msg_header}>
                                <p>Members</p>
                            </div>
                            <div className={style.channels}>
                                {
                                    members.map((val)=> (
                                        <div key={val.uid} className={style.channel_info}>
                                            <FontAwesomeIcon style={{marginTop: "4px", marginRight: "4px"}}
                                                             icon={faHashtag}/>
                                            <p style={{userSelect: "none", fontSize: "16px"}}>{val.username}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                    <UserBox username={user.username}/>
                </div>
                <div className={style.chat_box}>
                    <ChatBox messages={messages} displayName={queryParams.get("name")} cid={cid} user={user} directMsg={false}/>
                </div>

            </div>

        </>
    );
}

