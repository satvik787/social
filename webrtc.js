import {Socket} from "socket.io-client";

export default class Stream {

    static server = {
        iceServers: [

            {
                urls: [
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                    "stun:stun.services.mozilla.com",
                ],
            },
            {
                urls: "turn:in.relay.metered.ca:80",
                username: "0d4dabb868b66c7a0008f452",
                credential: "pCpQC3G1L5xouPbF",
            },
        ],
        iceCandidatePoolSize: 10,
    }
    constructor(socket= new Socket()) {
        this.socket = socket;
        this.localStream = null;
    }

    async init(){

        this.socket.removeAllListeners("io:candidate");
        this.socket.removeAllListeners("io:answer");
        this.socket.removeAllListeners("io:offer");
        this.socket.on("io:candidate",({to,peerUserName,candidate})=>{
            if(to === localStorage.getItem("userName")) {
                this.setCandidate(peerUserName, candidate);
            }
        });
        this.socket.on("io:answer",({to,peerUserName,answer})=>{
            if(to === localStorage.getItem("userName")){
                this.setAnswer(peerUserName,answer);
            }
        });
        this.socket.on("io:offer",({to,peerUserName,offer})=>{
            if(to === localStorage.getItem("userName")){
                this.createAnswer(peerUserName,offer);
            }
        });

    }

    async newConnection(peerUserName){

        const connection = new RTCPeerConnection(VideoStream.server);
        const remoteStream = new MediaStream();
        connection.ontrack = (event)=>{
            console.log("GOT TRACK");
            event.streams[0].getTracks().forEach((track)=>{
                remoteStream.addTrack(track);
            });
        }
        connection.onicecandidate = async (event) => {
            if(event.candidate){
                setTimeout(()=>{
                    console.log("ICE GEN");
                    this.socket.emit("stream:candidate",{candidate:event.candidate,peerUserName:peerUserName,userName:localStorage.getItem("userName")});
                },800);
            }
        }
        return connection;
    }

    async createOffer(peerUserName){
        const configuration = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        }
        const connection = await this.newConnection(peerUserName);
        this.localStream = await navigator.mediaDevices.getUserMedia({audio:true});
        this.localStream.getTracks().forEach((track)=>{
            connection.addTrack(track,this.localStream);
        });
        console.log("in OFFER",this.connections," peerUSERNAME ",peerUserName);
        const offer = await connection.createOffer(configuration);
        await connection.setLocalDescription(offer);
        this.socket.emit("stream:offer",{offer:offer,peerUserName:peerUserName,userName:localStorage.getItem("userName")});
    }

    async createAnswer(peerUserName,offer){
        const connection = await this.newConnection(peerUserName);
        await connection.setRemoteDescription(offer);
        this.localStream = await navigator.mediaDevices.getUserMedia({audio:true});
        this.localStream.getTracks().forEach((track)=>{
            connection.addTrack(track,this.localStream);
        });
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        this.socket.emit("stream:answer",{answer:answer,peerUserName:peerUserName,userName:localStorage.getItem("userName")});
    }



    async setAnswer(peerUserName,answer){
        console.log("in setAnswer ",this.connections," peerUSERNAME ",peerUserName);
        await this.connections.get(peerUserName).setRemoteDescription(answer);
    }

    async removeConnection(peerUserName){
        await this.connections.get(peerUserName).close();
        this.connections.delete(peerUserName);
    }


    toggleAudio(val){
        const audio = this.localStream.getTracks().find((track)=> track.kind === 'audio');
        audio.enabled = val;
    }

    toggleCamera(val){
        const videoTrack = this.localStream.getTracks().find((track)=> track.kind === 'video');
        videoTrack.enabled = val;
    }

}