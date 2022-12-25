import "dotenv/config"
import { z } from "zod";
import nodemailer from "nodemailer";

export enum MAILS{
    CONFIRM = "confirm your account",
    RESET = "reset your password",
}

const linkType = z.string().url("invalid url");

const passwordType = z.string();

const genConfirmMessage = (link:string)=>{
    link = linkType.parse(link);
    return `follow the link to confirm your account, ${link} `
}

const genResetMessage = (password:string)=>{
    password = passwordType.parse(password);
    return `your new password is ${password}, never share this`
}

export interface IMailTransportParams{
    reciepient:string;
    type: keyof typeof MAILS | string;
    payload:string;
}

interface IMailOptions {
    from:string;
    to:string;
    subject?:string;
    text?:string;
}



export default class Mailer {

    private static transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.GMAIL_USER,
            pass:process.env.GMAIL_PASS
        }
    })
    static async sendMail({reciepient,type,payload}:IMailTransportParams):Promise<Boolean>{
        console.log("TEST",process.env.GMAIL_USER)
        const mailOptions:IMailOptions = {
            from: process.env.MAIL_NAME || "<support@fpn.ng>",
            to:reciepient
        };
       
        switch (type) {
            case MAILS.CONFIRM:
                mailOptions.subject = MAILS.CONFIRM;
                mailOptions.text = genConfirmMessage(payload);
                break;
            case MAILS.RESET:
                mailOptions.subject = MAILS.RESET;
                mailOptions.text = genResetMessage(payload);
            default:
                throw new Error("invalid mail type");
        }
        try{
        const response = await this.transporter.sendMail(mailOptions);
        console.log(response)
        if(!response){
            return false;
        }
        return true;
        }catch(err){
            console.log(err);
            throw new Error((err as Error).message)
        }
    }
}