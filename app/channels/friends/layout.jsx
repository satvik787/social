import style from "./layout.module.css"
import {cache} from "react";
import FriendsSideBar from "@/app/channels/friends/Components/FriendsSideBar";
import {getAllFriends} from "@/db/dao.js";
import {getSession} from "@/actions/lib.js";
import {redirect} from "next/navigation";

export const cGetAllFriends = cache(getAllFriends);

export default async function Layout({children}) {
    const payload = await getSession();
    if(payload === null){
        redirect("/login");
    }
    const allFriends = await cGetAllFriends(payload.id);
    return (
        <div className={style.main_box}>
            <div className={style.friends_list}>
                <FriendsSideBar allFriends={allFriends} username={payload.username}/>
            </div>
            <div className={style.children}>
                {children}
            </div>
        </div>
    );
}