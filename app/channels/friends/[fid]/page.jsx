import React from 'react';
import ChatBox from "@/app/channels/Components/ChatBox";
import {getSession} from "@/actions/lib.js";
import {areFriends} from "@/actions/friendRequest.js";
import {redirect} from "next/navigation";
import {getDirectMessages} from "@/actions/messages";


export default async function Page({params}) {
    const payload = await getSession();
    const fid = params.fid;
    const res = await areFriends(fid,payload.id);
    if(res.length === 0){
        redirect("/channels/friends");
    }
    const [friends,messages] = await getDirectMessages(fid);
    const friendID = friends[0].f1 !== payload.id ? friends[0].f1:friends[0].f2;
    return (
        <>
            <div style={{height:"100%"}}>
                <ChatBox messages={messages} displayName={res[0].userName} user={payload} uid={payload.id} cid={fid} friendID={friendID}  />
            </div>
        </>
    );
}
