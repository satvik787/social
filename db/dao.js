import {
    channel,
    channel_invite,
    direct_msg,
    friends, msg,
    participant,
    pending_friend_req,
    user
} from "@/db/schema";
import {and, asc, eq, or} from "drizzle-orm";
import {v4 as uuid4} from "uuid";
import {getDB} from "@/db/connectDB.js";
import {use} from "bcrypt/promises.js";


export async function insertUser(userObj) {
    const db = await getDB();

    const res = await db.insert(user).values(userObj);
    if (res.length > 0 && res[0].affectedRows > 0) {
        return {ok: true, userId: res[0].insertId, msg: "inserted successfully"};
    }
    return {ok: false, msg: "failed to add user"};
}

export async function emailExist(email) {
    const db = await getDB();

    const res = await db.select({
        uid: user.uid,
        username: user.username,
        password: user.password
    }).from(user).where(eq(user.email, email));
    return {ok: true, exist: res.length > 0, data: res[res.length - 1]};
}

export async function usernameExist(username) {
    const db = await getDB();
    const res = await db.select({
        uid: user.uid,
        username: user.username,
        password: user.password,
        displayName: user.display_name,
        status: user.status,
        img: user.user_icon
    }).from(user).where(eq(user.username, username));
    return {ok: true, exist: res.length > 0, data: res[res.length - 1]};
}

export async function areFriends(fid, uid) {
    const db = await getDB();

    const condition = or(eq(friends.user, uid), eq(friends.friend, uid));
    const res = await db.select().from(friends).where(and(eq(friends.fid, fid), condition));
    if (res.length !== 0) {
        const id = res[0].user === uid ? res[0].friend : res[0].user;
        return db.select({userName: user.username}).from(user).where(eq(user.uid, id));
    }
    return res;
}

export async function sendFriendRequest(username, from) {
    const db = await getDB();

    const userRes = await usernameExist(username);
    if (userRes.exist && from !== userRes.data.uid) {
        let conditionA = and(eq(pending_friend_req.from, userRes.data.uid), eq(pending_friend_req.to, from));
        let conditionB = and(eq(pending_friend_req.to, userRes.data.uid), eq(pending_friend_req.from, from));
        const pair = await db.select().from(pending_friend_req).where(or(conditionA, conditionB));
        if (pair.length === 0) {
            const res = await areFriends(userRes.data.uid, from);
            if (res.length === 0) {
                await db.insert(pending_friend_req).values({from: from, to: userRes.data.uid});
                return {
                    ok: true,
                    data: {
                        uid: userRes.data.uid,
                        username: userRes.data.username,
                        displayName: userRes.data.displayName,
                        status: userRes.data.status,
                        img: userRes.data.img
                    }
                };
            }
            return {ok: false, msg: "You are already friends ni"};
        }
        return {ok: false, msg: "A friend Request is still pending"};
    } else return {ok: false, msg: "username does not exist"};
}

export async function getAllPendingRequest(id) {
    const db = await getDB();

    return db.select({
        uid: user.uid,
        username: user.username,
        displayName: user.display_name,
        status: user.status,
        img: user.user_icon
    }).from(pending_friend_req).innerJoin(user, eq(user.uid, pending_friend_req.to)).where(eq(pending_friend_req.from, id));
}

export async function getAllFriends(id) {
    const db = await getDB();

    const conditionA = and(eq(user.uid, friends.friend), eq(friends.user, id));
    const conditionB = and(eq(user.uid, friends.user), eq(friends.friend, id));
    return db.select({
        fid: friends.fid,
        uid: user.uid,
        username: user.username,
        displayName: user.display_name,
        status: user.status,
        img: user.user_icon
    }).from(friends).innerJoin(user, or(conditionA, conditionB));
}

export async function getFriendInvites(id) {
    const db = await getDB();

    return db.select({
        uid: user.uid,
        username: user.username,
        displayName: user.display_name,
        status: user.status,
        img: user.user_icon

    }).from(pending_friend_req).innerJoin(user, eq(user.uid, pending_friend_req.from)).where(eq(pending_friend_req.to, id));
}

export async function deleteRequest(from, to) {
    const db = await getDB();

    return db.delete(pending_friend_req).where(and(eq(pending_friend_req.from, from), eq(pending_friend_req.to, to)));
}

export async function acceptRequest(from, to) {
    const db = await getDB();

    const res = await deleteRequest(from, to);
    if (res[0].affectedRows > 0) {
        const res = await db.insert(friends).values({user: from, friend: to});
        if (res[0].affectedRows > 0) {
            return {ok: true,fid:res[0].insertId};
        }
        else return {ok: false, msg: "friend Request Failed at insert"};
    }
    return {ok: false, msg: "friend Request Failed at pending"}
}



export async function insertParticipant(obj) {
    const db = await getDB();

    const res = await db.insert(participant).values(obj);
    if (res.length > 0 && res[0].affectedRows > 0) {
        return {ok: true};
    }
    throw new Error("failed to insert participant");
}

export async function insertChannel(channelObj) {
    const db = await getDB();

    const res = await db.insert(channel).values({
        name: channelObj.name,
        invite_id: uuid4(),
        created_by: channelObj.uid
    });
    if (res.length > 0 && res[0].affectedRows > 0) {
        const cid = res[0].insertId;
        const a = await insertParticipant({uid: channelObj.uid, cid, auth_lvl: 2})
        if (a.ok) {
            return {cid,ok: true, msg: "channel successfully created"};
        }
    }
    throw new Error(`failed to insert channel ${channelObj.name}`);

}

async function channelExists(cid) {
    const db = await getDB();
    const res = await db.select({cid:channel.cid}).from(channel).where(eq(channel.cid,cid));
    return res.length > 0;
}
async function isFriend(f1,f2){
    const db = await getDB();
    const conditionA = and(eq(f1, friends.friend), eq(friends.user, f2));
    const conditionB  = and(eq(f2, friends.friend), eq(friends.user, f1));
    const res = await db.select({fid:friends.fid}).from(friends).where(or(conditionA,conditionB));
    return res.length > 0;
}
export async function insertChannelInvite(obj) {
    const [a,b,c] = await Promise.all([channelExists(obj.cid),isParticipant(obj.cid,obj.to),isFriend(obj.to,obj.from)]);
    if(a && !b && c) {
        const db = await getDB();
        const condition = and(eq(channel_invite.cid,obj.cid),and(eq(channel_invite.from,obj.from),eq(channel_invite.to,obj.to)))
        const pendingInvite = await db.select({id:channel_invite.ciid}).from(channel_invite).where(condition);
        if(pendingInvite.length > 0)return {ok:false,msg:"pending request"};
        const res = await db.insert(channel_invite).values(obj);
        if (res.length > 0 && res[0].affectedRows > 0) {
            return {ok: true,ciid:res[0].insertId,to:obj.to};
        }
        return {ok: false, msg: "failed to insert"};
    }
    return {ok: false, msg:"either participant exist or no channel"};
}
export async function selectChannelInvites(uid){
    const db = await getDB();
    return  db.select({channel:channel.name,...channel_invite,username:user.username})
        .from(channel_invite)
        .innerJoin(channel,eq(channel.cid,channel_invite.cid))
        .innerJoin(user,eq(user.uid,channel_invite.from))
        .where(eq(channel_invite.to,uid));
}
export async function acceptChannelInvite({ciid,uid,cid}){
    const db = await getDB();
    console.log(ciid,uid,cid);
    const res = await db.delete(channel_invite).where(and(eq(channel_invite.ciid,ciid),eq(channel_invite.to,uid)));
    console.log("DELETE RES",res)
    if(res.length > 0 && res[0].affectedRows > 0) {
        return await insertParticipant({uid,cid});
    }
    return {ok:false,msg:"invalid request"};
}

export async function selectChannels(uid) {
    const db = await getDB();

    return db.select(channel).from(participant).innerJoin(channel, eq(participant.cid, channel.cid)).where(eq(participant.uid, uid));
}
export async function insertDirectMsg(msgObj) {
    const db = await getDB();

    const res = await db.insert(direct_msg).values(msgObj);
    if (res[0].affectedRows > 0) {
        return {ok: true};
    }
    throw new Error("failed to insert dm");
}
export async function getDirectMsg(fid) {
    const db = await getDB();

    return Promise.all([
        db.select({f1: friends.user, f2: friends.friend}).from(friends).where(eq(friends.fid, fid)),
        db.select({username: user.username, ...direct_msg}).from(direct_msg).innerJoin(user, eq(direct_msg.uid, user.uid)).where(eq(direct_msg.fid, fid)).orderBy(asc(direct_msg.send_at))
    ]);
}

export async function insertMsg(msgObj) {
    const db = await getDB();
    const res = await db.insert(msg).values(msgObj);
    if (res[0].affectedRows > 0) {
        return {ok: true};
    }
    throw new Error("failed to insert msg");
}

export async function selectChannelMsg(cid) {
    const db = await getDB();

    return db.select({username:user.username,...msg}).from(msg).innerJoin(user,eq(user.uid,msg.uid)).where(eq(msg.cid, cid)).orderBy(asc(msg.send_at));
}


export async function isParticipant(cid,uid){
    const db = await getDB();
    const pid = await db.select({pid:participant.pid}).from(participant).where(and(eq(participant.cid,cid),eq(participant.uid,uid)));
    return pid.length > 0;
}

export async function getChannelMembers(cid){
    const db = await getDB();
    return db.select({username:user.username,uid:user.uid}).from(participant).innerJoin(user,eq(user.uid,participant.uid)).where(eq(participant.cid,cid));
}