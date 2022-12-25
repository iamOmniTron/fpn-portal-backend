import db from "../database/models";
import { Request,Response,NextFunction } from "express";
import { genMatricNumber, paramsToObject } from "../helpers/utils";
import { Candidate } from "../database/models/candidate";


export const GetMyAdmission = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId;
        const admission = await db.Admission.findOne({include:[{model:db.Candidate,where:{id:candidateId},required:true}]});
        if(!admission){
            return res.json({
                success:false,
                message:"Invalid Candidate"
            })
        }

        return res.json({
            success:true,
            data:admission
        })
    }catch(err){
        return next(err);
    }
}

export const AcceptAdmission = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.params.candidateId;
        // @ts-ignore
        const isUpdated = await db.Admission.update({status:"accepted"},{where:{CandidateId:candidateId}});
        if(isUpdated[0] < 1){
            return res.json({
                success:false,
                message:"Error Accepting Admission"
            })
        }
        const matricNo = genMatricNumber();
        const isCandidateUpdated = await Candidate.update({matricNumber:matricNo},{where:{id:candidateId}});
        if(!isCandidateUpdated){
            return res.json({
                success:false,
                message:"Error generating matric number"
            })
        }
        return res.json({
            success:true,
            message:"Admission Accepted successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const RejectAdmission = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.params.candidateId;
        // @ts-ignore
        const isUpdated = await db.Admission.update({status:"rejected"},{where:{CandidateId:candidateId}});
        if(isUpdated[0] < 1){
            return res.json({
                success:false,
                message:"Error Rejecting Admission"
            })
        }
        return res.json({
            success:true,
            message:"Admission Rejected successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const GetAllAdmissions = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const filter = paramsToObject(req.query);
        const admissions = await db.Admission.findAll({where:{...filter},include:[{model:db.Candidate,required:true}]})
        return res.json({
            success:true,
            data:admissions
        })
    }catch(err){
        return next(err);
    }
}