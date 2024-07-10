export default function init(io,socket,userSocket,userData,channels){
    socket.on("direct:newMsg",(args)=>{
        let {friendID, text, fid, uid} = args;
        friendID = Number(friendID);
        fid = Number(fid);
        uid = Number(uid);
        if(userSocket.has(friendID)){
            userSocket.get(friendID).emit(`direct:gotMsg:${fid}`,{text,from:userData.get(uid).username});
        }
    });
    socket.on("ping",(args)=>{
        let {uid,username} = args;
        uid = Number(uid);
        userSocket.set(uid,socket);
        userData.set(uid,{username:username,exp:Date.now() + 60 * 60 * 1000});
    });

    socket.on("channel:register",(args)=>{
        if(!channels.has(Number(args.cid))){
            channels.set(Number(args.cid),new Map());
        }
        channels.get(Number(args.cid)).set(Number(args.uid),Date.now() + 60 * 60 * 1000);
    });

    socket.on("newMsg",(args)=>{
        let {cid,uid,text} = args;
        cid = Number(cid);
        uid = Number(uid);
        for(let [ouid,exp] of channels.get(cid)){
            const socketExpTime = userData.get(ouid).exp;
            if(Date.now() >= socketExpTime){
                userData.delete(ouid);
                userSocket.delete(ouid);
                continue;
            }
            if(Date.now() < exp && ouid !== uid){
                userSocket.get(ouid).emit(`gotMsg:${cid}`,{text,from:userData.get(uid).username});
            }
        }
    });

    socket.on("channel:invite",(args)=>{
        let {cid,to,channel,username,ciid} = args;
        to = Number(to);
        const socket = userSocket.get(to);
        if(Date.now() >= userData.get(to).exp){
            userData.delete(to);
            userSocket.delete(to);
            return;
        }
        socket.emit("channel:gotInvite",args);
    });

    socket.on("friend:invite",(args)=>{
        let {to} = args;
        to = Number(to);
        const socket = userSocket.get(to);
        if(Date.now() >= userData.get(to).exp){
            userData.delete(to);
            userSocket.delete(to);
            return;
        }
        socket.emit("friend:gotInvite",args);
    });
    socket.on("friend:invite:accepted",(args)=>{

    })
}