import Link from "next/link";
import {getSession} from "@/actions/lib";

async function LoginButton({className}) {
    const data = await getSession();
    if(data){
        return <></>
    }
    return <Link href={"/login"} className={className}>Login</Link>;
}

export default LoginButton;