'use client';
import style from "./signup.module.css"
import Link from "next/link";
import { useFormState ,useFormStatus} from "react-dom";
import {useRouter} from "next/navigation";
import {signup} from "@/actions/signup";
import {useMemo} from "react";

function SubmitButton() {
    const {pending} = useFormStatus();
    return <button className={style.sign_up_btn} disabled={pending}>Sign Up</button>;
}
const monthName = ["January", "February", "March", "April", "May","June", "July", "August", "September", "October", "November","December"]
export default function SignUp(){
    const router = useRouter();
    const [formState,formAction] = useFormState(signup,null);
    const monthOptions = monthName.map((val,i) => <option key={i + 1} value={i + 1}>{val}</option>);
    const dayOptions = useMemo(()=> new Array(31).fill(0).map((val,ind)=> <option key={ind + 1} value={ind + 1}>{ind + 1}</option>),[]);
    const yearOptions = useMemo(()=>new Array(130).fill(0).map((val,ind)=> <option key={ind + 1} value={2020 - ind}>{2020 - ind}</option>),[]);

    console.log(formState);

    if(formState !== null && formState.ok)router.push('/login');
    const passwordErr = formState !== null && !formState.ok && formState.msg.password;
    const emailErr = formState !== null && !formState.ok && formState.msg.email;
    const displayNameErr = formState !== null && !formState.ok && formState.msg.displayName;
    const userNameErr = formState !== null && !formState.ok && formState.msg.username;



    return (
        <>
            <div className={style.background}>
                <img width={"100%"} src={"/644fab4db9ca0a124b73d4b7_c40c84ca18d84633a9d86b4046a91437.svg"} className={style.left_img}/>
                <div className={style.sign_up_box}>
                    <h3>Create account</h3>
                    <form action={formAction} className={style.form}>
                        <label className={style.label}>Email {emailErr && <span> {formState.msg.email} </span>}</label>
                        <input name={"email"} type={"email"} className={style.input} />
                        <label className={style.label}>Display Name {displayNameErr && <span> {formState.msg.displayName} </span>} </label>
                        <input name={"displayName"} type={"text"} className={style.input} />
                        <label className={style.label}>UserName {userNameErr && <span> {formState.msg.username} </span>}</label>
                        <input name={"username"} type={"text"}  className={style.input}/>
                        <label className={style.label}>Password {passwordErr && <span> {formState.msg.password} </span>} </label>
                        <input name={"password"} type={"password"} className={style.input}/>
                        <label className={style.label}>Date of Birth</label>
                        <div className={style.dob}>
                            <select name={"day"}  className={style.select}>
                                {[<option key={0} disabled selected>Day</option>,...dayOptions]}
                            </select>
                            <select name={"month"}  className={style.select}>
                                {[<option key={0} disabled selected>Month</option>,...monthOptions]}
                            </select>
                            <select name={"year"}  className={style.select}>
                                {[<option key={0} disabled selected>Year</option>,...yearOptions]}
                            </select>
                        </div>
                        <SubmitButton/>
                    </form>
                    <Link href={"/login"} className={style.anchor}>Already Have an Account?</Link>
                </div>
                <img width={"100%"} src={"/644fab4df2dc8d7a9a081ebd_8a8375ab7908384e1fd6efe408284203.svg"} className={style.right_img}/>
            </div>
        </>
    );
}