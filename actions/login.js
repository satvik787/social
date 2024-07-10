'use server'
import {usernameExist} from "@/db/dao";
import bcrypt from "bcrypt";
import {z} from "zod";
import {generateToken, validate} from "./lib";
import {cookies} from "next/headers";
import dao from "@/db/dao";

const loginValidation = z.object({
    username:z.string()
        .trim()
        .min(5,{message:"username  Must be 5 or more characters long"})
        .max(250,{message:"username Must be 250 or fewer characters long"}),
    password:z.string()
        .trim()
        .min(8,{message:"password Must be 8 or more characters long"})
        .max(150,{message:"password Must be 150 or fewer characters long"}),

});


export async function login(init,formData){
    try{

        const validationErr = validate(loginValidation,{
            username:formData.get("username"),
            password:formData.get("password")
        });
        if(validationErr)return validationErr;
        const res = await usernameExist(formData.get("username"));
        if(res.exist){
            const passwordMatch = await bcrypt.compare(formData.get("password"),res.data.password);
            if(passwordMatch){
                const token = await generateToken({id:res.data.uid,username:res.data.username});
                cookies().set("token",token,{expires:Date.now() + 60000 * 60});
                return {ok:true};
            }else {
                return {ok:false,msg:{password:"incorrect password"}};
            }
        }else{
            return {ok:false,msg:{username:"username or email does not Exist"}};
        }
    }catch (e){
        return {ok:false,msg:e.message}
    }
}