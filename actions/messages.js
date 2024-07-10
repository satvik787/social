'use server'
import {getDirectMsg, insertDirectMsg, insertMsg, selectChannelMsg} from "@/db/dao.js";
import z from "zod";
import {validate} from "@/actions/lib.js";

const directMessageValidation = z.object({
    uid:z.number().positive(),
    fid:z.number().positive(),
    text:z.string().trim().min(1).max(255)
});
const messageValidation = z.object({
    uid:z.number().positive(),
    cid:z.number().positive(),
    text:z.string().trim().min(1).max(255)
});
export async function getDirectMessages(fid){
    try{
        return getDirectMsg(fid);
    }catch (e){
        return {ok:false,msg:e.message}
    }
}

export async function getChannelMessages(cid){
    try{
        return selectChannelMsg(cid);
    }catch (e){
        return {ok:false,msg:e.message}
    }
}
export async function saveDirectMessage(obj){
    try{
        const validationErr = validate(directMessageValidation,obj);
        if(validationErr)return validationErr;
        const res = await insertDirectMsg(obj);
        if(res.ok){
            return res;
        }
        return {ok:false,msg:"failed to save message"};
    }catch (e){
        return {ok:false,msg:e.message};
    }
}
export async function saveMessage(obj){
    try{
        const validationErr = validate(messageValidation,obj);
        if(validationErr)return validationErr;
        const res = await insertMsg(obj);
        if(res.ok){
            return res;
        }
        return {ok:false,msg:"failed to save message"};
    }catch (e){
        return {ok:false,msg:e.message};
    }
}
