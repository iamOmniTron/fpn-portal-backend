import {Request,Response,NextFunction} from "express";
import { confirmRegistrationPayment, generateRegistrationFeeDetails, getMyPayments, getPayments } from "../services/payment";

export const GenerateRegistrationFeeDetails = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId;
        const response = await generateRegistrationFeeDetails(candidateId);
        if(!response){
            return res.json({
                success:false,
                message:"Cannot generate payment details"
            })
        }
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const ConfirmRegistrationPayment = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const paymentId = req.params.paymentId;
        const candidateId = req.userId;
        const response = await confirmRegistrationPayment(paymentId,candidateId);
        if(!response){
            return res.json({
                success:false,
                message:"cannot confirm payment"
            })
        }

        return res.json({
            success:true,
            message:"Payment confirmed"
        })
    }catch(err){
        return next(err);
    }
}

export const GetMyPayments = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId;
        const response = await getMyPayments(candidateId);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}


export const GetPayments = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const response = await getPayments();

        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}