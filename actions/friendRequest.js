'use server'
import {z} from "zod"
import {getSession, validate} from "@/actions/lib";
import {
    sendFriendRequest,
    acceptRequest as accept_request,
    deleteRequest as delete_request,
    areFriends as are_friends
} from "@/db/dao";
import {redirect} from "next/navigation";
import {revalidateTag} from "next/cache.js";
import {GET_FRIEND_INVITES, GET_PENDING_FRIEND_REQUEST} from "@/Cache/tags.js";

const requestValidation = z.object({
    username:z.string().trim().min(5,{message:"username is at least 5 character long"}).max(250)
});
export default async function friendRequest(init,formData){
    let payload = null;
    try {
        payload = await getSession();
        if (payload != null) {
            const validationErr = validate(requestValidation, {username: formData.get("username")});
            if (validationErr) return validationErr;
            const res = await sendFriendRequest(formData.get("username"), payload.id);
            if (res.ok) {
                revalidateTag(GET_PENDING_FRIEND_REQUEST + payload.id);
                revalidateTag(GET_FRIEND_INVITES + res.data.uid);
                return {ok:true,data:res.data,msg:{username: "friend Request sent successfully"}};
            }
            return {ok: false, msg: {username: res.msg}};
        }
    }catch (e){
        return {ok:false,msg:{server:e.message}};
    }
    if(payload == null)redirect("/login");
}
export async function acceptRequest(from,to){
    let payload = null;
    try {
        payload = await getSession();
        if (payload != null) {
            const res = await accept_request(from,to);
            if(res.ok){
                revalidateTag(GET_FRIEND_INVITES + payload.id);
                revalidateTag(GET_PENDING_FRIEND_REQUEST + from);
                return res;
            }
            return {ok:false,msg:"Failed to accept Request"};
        }
    }catch (e){
        return {ok:false,msg:{server:e.message}};
    }
    if(payload == null)redirect("/login");
}
export async function deleteRequest(from,to){
    let payload = null;
    try {
        payload = await getSession();
        if (payload != null) {
            const res = await delete_request(from,to);
            if(res[0].affectedRows > 0)return {ok:true};
            return {ok:false,msg:"failed to delete friend request"};
        }
    }catch (e){
        return {ok:false,msg:{server:e.message}};
    }
    if(payload == null)redirect("/login");
}

export async function areFriends(fid,uid){
    try{
        return are_friends(fid,uid);
    }catch (e){
        return {ok:false,msg:e.message};
    }
}