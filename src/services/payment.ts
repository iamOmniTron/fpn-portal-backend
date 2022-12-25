import "dotenv/config";
import db from "../database/models";
import {randomBytes} from "crypto";

const FRONTEND_URL = process.env.FRONT_END_URL as string;


enum FEES {
    REGISTRATION = "Registration fees",
    SCHOOL_FEE = "School Fees"
}

enum AMOUNTS {  
    REGISTRATION = 5000,
    SCHOOL_FEE = 20000
}


export const generateRegistrationFeeDetails = async (candidateId:string)=>{
    try{
        const description = FEES["REGISTRATION"];
        const amount = AMOUNTS["REGISTRATION"];
        const refId = randomBytes(12).toString("hex");
        const link = `${FRONTEND_URL}/applicant/payment/registration/${refId}`;
        const payment = await db.Payment.findOne({where:{confirmed:false},include:[{model:db.Candidate,where:{id:candidateId}}]});
        if(payment && payment !== null){
            return payment;
        }
        // @ts-ignore
        const newPayment = await db.Payment.create({description,amount,refId,link,confirmed:false,CandidateId:candidateId});
        return newPayment;
    }catch(err){
        throw new Error((err as Error).message)
    }
}

export const confirmRegistrationPayment = async (paymentId:string,candidateId:string):Promise<Boolean>=>{
    try{
        const payment = await db.Payment.update({confirmed:true},{where:{id:paymentId}});
        if(payment[0] <1){
            return false;
        }
        // @ts-ignore
        const isUserConfirmed = await db.Candidate.update({paid:true,isVerified:true},{where:{id:candidateId}});
        if(!isUserConfirmed) return false;
        return true;
    }catch(err){
        throw new Error((err as Error).message)
    }
}

export const getMyPayments = async (candidateId:string)=>{
    try{
        const payments = await db.Payment.findAll({include:[{model:db.Candidate,where:{id:candidateId}}]});
        return payments;
    }catch(err){
        throw new Error((err as Error).message)
    }
}

export const getPayments = async ()=>{
    try{
        const payments = await db.Payment.findAll({include:[{model:db.Candidate}]});
        return payments;
    }catch(err){
        throw new Error((err as Error).message)
    }
}