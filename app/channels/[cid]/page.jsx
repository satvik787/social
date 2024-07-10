import ChannelPage from "@/app/channels/[cid]/ChannelPage";
import {getChannelMessages} from "@/actions/messages.js";
import {getSession} from "@/actions/lib.js";
import {channelMembers, isMember} from "@/actions/channel.js";
import {redirect} from "next/navigation";

export default async function Page({params}){
    const channelId = params.cid;
    const payload = await getSession();
    const member = await isMember(channelId,payload.id);
    if(!member){
        return redirect("/channels/friends");
    }
    const messages = await getChannelMessages(channelId);
    const members  = await channelMembers(channelId);
    return (
        <ChannelPage messages={messages} members={members} cid={channelId} user={payload}/>
    )
}