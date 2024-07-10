'use client';
import style from "./chatbox.module.css"
import { useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPhone} from "@fortawesome/free-solid-svg-icons/faPhone";
import {saveDirectMessage, saveMessage} from "@/actions/messages.js";
import {socket} from "@/socket";
import ChatMessage from "@/app/channels/Components/ChatMessage.jsx";
export default function ChatBox({messages=[],displayName="satvik",directMsg=true,cid,user,friendID=0}) {
    const messageBox = useRef(null);
    const [msg, setMsg] = useState(messages);
    const [text, setText] = useState("");
    const [call, setCall] = useState(false);
    useEffect(()=>{
        socket.emit("channel:register",{uid:user["id"],cid});
    },[cid, user])

    useEffect(() => {
        socket.emit("ping",{
            uid:user["id"],
            username:user["username"]
        });
        const cancelId = setInterval(()=>{
            socket.emit("ping",{
                uid:user["id"],
                username:user["username"]
            });
        },1200000);
        return ()=>{
            clearInterval(cancelId);
        }
    }, [user]);

    const handleKeyPress = (e)=>{
        if(e.keyCode === 13){
            if(directMsg){
                const obj = {text,fid:Number(cid),uid:Number(user["id"]) };
                socket.emit("direct:newMsg",{friendID,...obj});
                saveDirectMessage(obj)
                    .then((res)=>{
                        if(res.ok){
                            setMsg(prevState => [...prevState,{text,send_at:new Date(),username:user["username"]}])
                            setText("");
                        }else{
                            console.log(res);
                        }
                    }).catch(e => console.log(e));
            }else{
                const obj = {text,cid:Number(cid),uid:Number(user["id"]) };
                socket.emit("newMsg",obj);
                saveMessage(obj).then((res)=>{
                    if(res.ok){
                        setMsg(prevState => [...prevState,{text,send_at:new Date(),username:user["username"]}]);
                        setText("");
                    }else{
                        console.log(res);
                    }
                })
            }
        }
    }
    


    useEffect(()=>{
        if(messageBox !== null){
            messageBox.current.scrollTop  = messageBox.current.scrollHeight;
        }

    },[messageBox,msg]);

    useEffect(()=>{
        if(socket.active){
            if(directMsg){
                socket.on(`direct:gotMsg:${cid}`,(obj)=>{
                    setMsg(prevState => [...prevState,{text:obj.text,send_at:new Date(),username:obj["from"]}])
                });
            }else{
                socket.on(`gotMsg:${cid}`,(obj)=>{
                    setMsg(prevState => [...prevState,{text:obj.text,send_at:new Date(),username:obj["from"]}])
                })
            }
                
        }
        return ()=>{
            if(directMsg){
                socket.removeAllListeners(`direct:gotMsg:${cid}`);
            }else{
                socket.removeAllListeners(`gotMsg:${cid}`);
            }
        }
    },[cid, directMsg, user])
    console.log(msg)
    return (
        <>
            {
                call &&
                <div className={style.add_sub_channel_model} >
                    <h2 className={style.sub_channel_title}>Coming Soon</h2>
                </div>

            }
            <div className={style.box}>
                <nav className={style.navbar}>
                    <p>{`@${displayName}`}</p>
                    {
                        directMsg &&
                        <div>
                            <FontAwesomeIcon icon={faPhone} className={style.stream_comm_icon} onClick={()=>setCall(prevState => !prevState)}/>
                        </div>
                    }
                </nav>
                <div className={style.msg_box} ref={messageBox}>
                    {msg.map((item, ind) => (
                        <ChatMessage
                            msg={item.text}
                            username={item.username}
                            timestamp={item.send_at.toLocaleString()}
                            key={ind}>

                        </ChatMessage>
                    ))}
                </div>
                <div>
                    <input type="text" className={style.input_msg} value={text} placeholder={"Type A Message"}
                           onKeyDown={handleKeyPress} onChange={(e) => setText(e.target.value)}/>
                </div>
            </div>
        </>
    );
}

