"use client";
import style from "./userbox.module.css";


export default function UserBox({status="online",username="satvik",userIcon="/discord-mark-white.svg"}) {
    // const [microPhoneState, setMicroPhoneState] = useState(false);
    // const [outputState, setOutputState] = useState(false);
    // const router = useRouter();

    // const toggleMicrophone = ()=>{
    //     setMicroPhoneState(prevState => !prevState);
    // }
    // const toggleOutput = ()=>{
    //     setOutputState(prevState => !prevState);
    // }
    // const settingsHandle = ()=>{
    // }
    return (
        <div className={style.box}>
            <div className={style.user_info}>
                <div className={style.user_icon_wrapper}>
                    <img className={style.user_icon} src={userIcon} width={"100%"} height={"100%"}/>
                </div>
                <div >
                    <p>{username}</p>
                    <p className={style.status}>{status}</p>
                </div>
            </div>
            {/*<div >*/}
            {/*    <FontAwesomeIcon className={style.setting_icon} icon={microPhoneState  ? faMicrophone:faMicrophoneSlash} onClick={toggleMicrophone}/>*/}
            {/*    <FontAwesomeIcon className={style.setting_icon}  icon={outputState  ? faVolumeUp:faVolumeXmark} onClick={toggleOutput}/>*/}
            {/*    <FontAwesomeIcon className={style.setting_icon} icon={faGear} onClick={settingsHandle}/>*/}
            {/*</div>*/}
        </div>
    );
}

