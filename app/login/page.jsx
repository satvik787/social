'use client'
import style from "./login.module.css";
import Link from "next/link";
import { useFormState ,useFormStatus} from "react-dom";
import {useRouter} from "next/navigation";
import {login} from "@/actions/login";

function SubmitButton() {
    const {pending} = useFormStatus();
    return <button className={style.login_btn} disabled={pending}>Login</button>;
}
export default function Login() {
    const router = useRouter();
    const [state,formAction] = useFormState(login,null);
    const usernameErr =  state !== null && !state.ok && state.msg.username !== undefined;
    const passwordErr =  state !== null && !state.ok && state.msg.password !== undefined;
    console.log(state);
    if(state !== null && state.ok){
        router.push('/channels/friends');
    }
    return (
        <div className={style.background}>
            <img src={"/644fab4db9ca0a124b73d4b7_c40c84ca18d84633a9d86b4046a91437.svg"} width={"40%"}/>
            <div className={style.login_box}>
                <h3>Welcome Back !</h3>
                <p>{"We're so excited to see you again!"}</p>
                <form action={formAction} className={style.form} >
                    <div className={style.label}>
                        <label>userName <span>*</span> {usernameErr && <span>{state.msg.username}</span>} </label>
                    </div>
                    <input style={{marginBottom:"20px"}} type={"text"} className={style.input}  name={"username"}/>
                    <div className={style.label}>
                        <label  >Password <span>*</span> {passwordErr && <span>{state.msg.password}</span>} </label>
                    </div>
                    <input type={"password"} className={style.input}  name={"password"}/>
                    <Link href="/forgotpassword" className={style.forgot_pass}>Forgot Your Password?</Link>
                    <SubmitButton/>
                    <p style={{color:"#171616"}}>Need a Account ? <Link className={style.forgot_pass} href={"/signup"}>Register</Link></p>
                </form>
            </div>
        </div>
    );
}

