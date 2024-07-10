import {jwtVerify, SignJWT} from "jose";
import {cookies} from "next/headers";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);


export function validate(validator,body){
    try{
        validator.parse(body);
        return null;
    }catch (e){
        const msg = {};
        for(let i of e.issues){
            msg[[i.path]] = i.message;
        }
        return {ok:false,msg}
    }
}

export async function generateToken(data){
    return await new SignJWT(data)
        .setProtectedHeader({alg:"HS256"})
        .setIssuedAt()
        .setExpirationTime("60 min")
        .sign(secret);
}
export async function decrypt(token) {
    try{
        const {payload} = await jwtVerify(token,secret,{algorithms:["HS256"]});
        return payload;
    }catch (e){
        return null;
    }}
export async function getSession(){
    const token =  cookies().get("token")?.value;
    if(token === undefined)return null;
    return decrypt(token);
}