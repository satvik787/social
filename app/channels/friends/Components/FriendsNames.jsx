import style from "./friendNames.module.css";
import Link from "next/link";

function FriendsNames({friendObj}) {
    return (
        <Link key={friendObj.fid} className={style.box} href={`/channels/friends/${friendObj.fid}`}>
            <div className={style.user_icon_wrapper}>
                <img className={style.user_icon} src={friendObj.img || "/discord-mark-white.svg"} width={"100%"} height={"100%"}/>
            </div>
            <p className={style.username}>{friendObj.username}</p>
        </Link>
    );
}

export default FriendsNames;