'use client';
import style from "./channelsSideBar.module.css"
import {useEffect, useRef, useState} from "react";
import {faPlus, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {createChannel} from "@/actions/channel";
import Link from "next/link";
import {CHANNEL, useListener} from "@/app/Components/Store.js";

export default function ChannelsSideBar({uid,channelsData}) {
    const tooltip  = useRef(null);
    const [modal, setModal] = useState(false);
    const nameInput = useRef(null);
    const [channels, setChannels] = useState(channelsData);
    const newChannels = useListener(CHANNEL);

    function handleMouseOver(event){
        const coordinates = event.target.getBoundingClientRect()
        tooltip.current.style.display = "block";
        tooltip.current.style.left = (coordinates.right + 30) + "px";
        tooltip.current.style.top  = (coordinates.top + 4)+ "px";
        tooltip.current.children[0].innerText = event.target.getAttribute("data-value");
    }
    function handleMouseOut(){
        tooltip.current.style.display = "none";
    }
    function handleCreateChannel(){
        if(nameInput.current.value.trim().length > 0){
            const name = nameInput.current.value.trim();
            createChannel({name,uid}).then((res)=>{
                if(res.ok){
                    setModal(false);
                    setChannels((prev) => [...prev, {name:name, cid:res.cid,channel_banner:"/discord-logo-white.svg"}]);
                }else{
                    console.log(res);
                }
            });
        }
    }

    useEffect(() => {
        if(newChannels){
            setChannels((prev)=>[...prev,newChannels]);
        }
    }, [newChannels]);

    return (
        <>
            <div className={style.side_bar} >
                <div className={style.tooltip} ref={tooltip}>
                    <p></p>
                </div>
                <Link href={"/channels/friends"} className={style.channel} >
                    <img src="/discord-mark-white.svg" width={"70%"}  alt="me"  data-value={"Direct-Message"} onMouseOut={handleMouseOut} onMouseOver={handleMouseOver}/>
                </Link>
                <hr className={style.sep}/>
                {
                    channels.map((val)=> (
                        <Link href={{
                            pathname:`/channels/${val.cid}`,
                            query:{name:val.name}
                        }} key={val.cid} className={"channelIcon"} data-value={val.name}>
                            <div className={style.channel} data-value={val.name}>
                                <img src={val.channel_banner} width={"70%"} alt={val.name} data-value={val.name} onMouseOut={handleMouseOut} onMouseOver={handleMouseOver}/>
                            </div>
                        </Link>
                    ))
                }

                <div className={style.channel} data-value={"Create Channel"} onClick={()=>setModal(prevState => !prevState)} >
                    <FontAwesomeIcon style={{color:"white",height:"100%",width:"100%"}} data-value={"Create Channel"} onMouseOut={handleMouseOut} onMouseOver={handleMouseOver} icon={faPlus}/>
                </div>
            </div>
            {
                modal &&
                <div className={style.modal}>
                    <div className={style.modal_body}>
                        <div className={style.modal_top}>
                            <h1>Create Your Channel </h1>
                            <FontAwesomeIcon className={style.close} icon={faXmark} onClick={()=>setModal(false)}/>
                        </div>
                        <label htmlFor={"channelName"} className={style.modal_label} >Channel Name {}</label>
                        <input id={"channelName"} name={"name"} className={style.modal_input} ref={nameInput}/>
                        <button className={style.modal_btn} onClick={handleCreateChannel}>Create</button>
                    </div>
                </div>   
            }
        </>
    );
}

