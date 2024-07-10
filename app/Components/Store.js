import {useEffect, useState} from "react";
export const CHANNEL = "CHANNEL";
export const FRIENDS = "FRIENDS";
const globalState = {};
const listener = new Map();
export function useListener(type){
    const [state,setState] = useState(false);
    useEffect(() => {
        listener.set(type,setState);
        return ()=>{
            listener.set(type,null);
        }
    }, [setState,type]);
    return globalState[type];
}
export function dispatch(type,data){
    globalState[type] = data;
    listener.get(type)((prev)=>!prev)
}
