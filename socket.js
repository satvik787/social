"use client";
import { io } from "socket.io-client";
export const socket = io("");

socket.on("connect",(args)=>{
    console.log("CONNECTED");
})

