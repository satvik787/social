'use server'
import {NextResponse} from "next/server";
import {emailExist, insertUser, usernameExist} from "@/db/dao";
import bcrypt from "bcrypt";
import {z} from "zod";
import {validate} from "@/actions/lib";

const signUpValidation = z.object({
    username:z.string()
        .trim()
       .min(5,{message:"username  Must be 5 or more characters long"})
       .max(250,{message:"username Must be 250 or fewer characters long"}),
    password:z.string()
        .trim()
        .min(8,{message:"password Must be 8 or more characters long"})
        .max(150,{message:"password Must be 150 or fewer characters long"}),
    email:z.string()
        .trim()
        .email(),
    displayName:z.string()
        .trim()
        .min(5,{message:"display_name Must be 5 or more characters long"})
        .max(250,{message:"display_name Must be 250 or fewer characters long"}),
});


export async function signup(init,formData){
    try{
        console.log(formData)
        const validationErr = validate(signUpValidation,{
            email:formData.get("email"),
            username:formData.get("username"),
            password:formData.get("password"),
            displayName:formData.get("displayName"),
            day:formData.get("day"),
            month:formData.get("month"),
            year:formData.get("year")
        });
        if(validationErr)return validationErr;
        console.log(formData);
        const [emailRes,userNameRes] = await Promise.all([emailExist(formData.get("email")),usernameExist(formData.get("username"))]);
        const msg = {
            username:userNameRes.exist ? `${formData.get('userName')} userName exists`:undefined,
            email:emailRes.exist ? `${formData.get("email")} email exist`:undefined
        }
        if(emailRes.exist || userNameRes.exist){
            return {ok:false,msg};
        }
        const hashedPassword = await bcrypt.hash(formData.get("password"),10);
        const res = await insertUser({
            email:formData.get("email"),
            username:formData.get("username"),
            password:hashedPassword,
            display_name:formData.get("displayName"),
            dob:formData.get("year") + "-" +formData.get("month") + "-" +formData.get("day"),
        });
        if(res.ok){
            return {ok:true};
        }
    }catch (e){
        return {ok:false,msg:{server:e.message}}
    }
}