'use server'

import z from "zod";
import {validate} from "@/actions/lib";
import {
    acceptChannelInvite, getChannelMembers,
    insertChannel,
    insertChannelInvite,
    isParticipant, selectChannelInvites,
    selectChannels,
    usernameExist
} from "@/db/dao";
import {revalidateTag} from "next/cache.js";
import {CHANNEL_INVITES, GET_CHANNELS} from "@/Cache/tags.js";

const participantValidation = z.object({
    uid:z.number().positive(),
    cid:z.number().positive(),
    ciid:z.number().positive()
})

const channelValidation = z.object({
    uid:z.number().positive(),
    name:z.string().max(256).min(5)
});
const channelInviteValidation = z.object({
   to:z.number().positive(),
   from:z.number().positive(),
   cid:z.number().positive(),
});


export async function createChannel(obj){
    try{
        const validationErr = validate(channelValidation,obj);
        if(validationErr)return validationErr;
        const res = await insertChannel(obj);
        if(res.ok){
            revalidateTag(GET_CHANNELS + obj.uid);
            return res;
        }
        return {ok:false,msg:{name:"failed to create channel"}};
    }catch (e){
        return {ok:false,msg:e.message}
    }
}
export async function acceptChannelRequest(obj){
    try{
        const validationErr = validate(participantValidation,obj);
        if(validationErr)return validationErr;
        const res = await acceptChannelInvite(obj);
        if(res.ok){
            revalidateTag(GET_CHANNELS + obj.uid);
            revalidateTag(CHANNEL_INVITES + obj.uid);
            return res;
        }
        return {ok:false,msg:{name:"failed to add participant"}};
    }catch (e){
        return {ok:false,msg:e.message}
    }
}

export async function getChannels(uid){
    try{
        return selectChannels(uid);
    }catch (e){
        return {ok:false,msg:e.message}
    }
}

export async function isMember(cid,uid){
    try{
        return isParticipant(cid,uid);
    }catch (e){
        return {ok:false,msg:e.message}

    }
}

export async function inviteMember(init,formData){
    try{
        const username = formData.get("username");
        const user = await usernameExist(username);
        if(user.exist){
            const obj = {from:Number(formData.get("from")),to:user.data.uid,cid:Number(formData.get("cid"))};
            const validationErr = validate(channelInviteValidation,obj);
            if(validationErr)return validationErr;
            const res = await insertChannelInvite(obj);
            if(res.ok){
                revalidateTag(CHANNEL_INVITES + res.to);
                return res;
            }
            return {ok:false,msg:"internal failure"};
        }
        return {ok:false,msg:{username:"invalid username"}}
    }catch (e){
        return {ok:false,msg:e.message}
    }
}

export async function getChannelInvites(uid){
    try{
        return await selectChannelInvites(uid);
    }catch (e){
        return {ok:false,msg:e.message}
    }
}



export async function channelMembers(cid){
    try{
        return await getChannelMembers(cid);
    }catch (e){
        return {ok:false,msg:e.message}
    }
}
