'use client';
import style from "./chatMessage.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

export default function ChatMessage({userIcon = "/discord-mark-white.svg",msg ,username,timestamp}) {
    return (
        <div className={style.msg} >
            <div className={style.wrapper}>
                <div className={style.user_icon_wrapper}>
                    <img className={style.user_icon} src={userIcon} width={"32px"} height={"32px"}/>
                </div>
                <div className={style.msg_wrapper}>
                    <p >{username} <span className={style.timestamp}>{timestamp}</span></p>
                    <p className={style.msg_text}>
                        {msg}
                    </p>
                </div>
            </div>
            {/*<div className={style.msg_options} >*/}
            {/*    <FontAwesomeIcon icon={faTrash} className={style.msg_delete}/>*/}
            {/*    <FontAwesomeIcon icon={faEdit} className={style.msg_edit}/>*/}
            {/*</div>*/}
        </div>
    );
}

