import Friends from "@/app/channels/friends/Components/Friends";
import {getSession} from "@/actions/lib";
import {redirect} from "next/navigation";
import {getAllPendingRequest, getFriendInvites} from "@/db/dao";
import {cGetAllFriends} from "@/app/channels/friends/layout.jsx";
import {getChannelInvites} from "@/actions/channel.js";
import {unstable_cache} from "next/cache.js";
import {CHANNEL_INVITES, GET_FRIEND_INVITES, GET_PENDING_FRIEND_REQUEST} from "@/Cache/tags.js";


export default async function Page() {
    const payload = await getSession();
    if(payload === null)redirect('/login');
    const cachedGetAllPendingRequest = unstable_cache(
        (id)=> getAllPendingRequest(id),
        [GET_PENDING_FRIEND_REQUEST],
        {
            tags:[GET_PENDING_FRIEND_REQUEST + payload.id],
        }
    );
    const cachedGetFriendInvites = unstable_cache(
        (id) => getFriendInvites(id),
        [GET_FRIEND_INVITES],
        {
            tags:[GET_FRIEND_INVITES + payload.id],
        }
    );
    const cachedGetChannelInvites = unstable_cache(
        (id) => getChannelInvites(id),
        [CHANNEL_INVITES],
        {
            tags:[CHANNEL_INVITES + payload.id],
        }
    );
    const allFriends = await cGetAllFriends(payload.id);
    const pendingRequests = await cachedGetAllPendingRequest(payload.id);
    const friendsInvites = await cachedGetFriendInvites(payload.id);
    const channelRequests = await cachedGetChannelInvites(payload.id);
    return (
        <>
            <Friends
                uid={payload.id}
                username={payload.username}
                pendingRequest={pendingRequests}
                channelRequest={channelRequests}
                friendsInvites={friendsInvites}
                allFriends={allFriends}/>
        </>
    )
}