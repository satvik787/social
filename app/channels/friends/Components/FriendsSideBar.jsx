'use client'
import React, {useEffect, useState} from 'react';
import style from "./friendsSideBar.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import FriendsNames from "@/app/channels/friends/Components/FriendsNames";
import UserBox from "@/app/channels/Components/UserBox";
import Link from "next/link";
import {FRIENDS, useListener} from "@/app/Components/Store.js";

export default  function FriendsSideBar({username,allFriends}) {
    const [friends, setFriends] = useState(allFriends);
    const newFriend = useListener(FRIENDS);
    useEffect(() => {
        if(newFriend){
            setFriends((prevState) => [...prevState,newFriend])
        }
    }, [newFriend]);
    return (
        <>
            <div className={style.box}>
                {/*<input type="text" className={style.search_box} placeholder={"Search Friends"}/>*/}

                <Link className={style.friends} href={"/channels/friends"}>
                    <FontAwesomeIcon style={{marginRight:"10px"}} icon={faUser} width={"16px"}/>
                    Friends
                </Link>
                <div className={style.direct_msg_header}>
                    <p >DIRECT MESSAGE</p>
                </div>
                <div className={style.friends_list}>
                    {friends.map((val)=> (
                        <FriendsNames key={val.uid} friendObj={val}/>
                    ) )}
                </div>
            </div>
            <UserBox username={username}/>
        </>
    );
}
