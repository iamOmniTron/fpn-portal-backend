import "dotenv/config";
import { compare } from "bcrypt";
import { Request,Response,NextFunction } from "express";
import {z} from "zod";
import db from "../database/models";
import { paramsToObject } from "../helpers/utils";
import { deleteCandidate, getCandidate, getCandidates, loginRegisteredCandidate, loginUnregisteredCandidate, signupCandidate, updateCandidate } from "../services/candidate";
import { sign } from "jsonwebtoken";


const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

const signupCandidateSchema = z.object({
    email:z.string().email("invalid email"),
    password: z.string().min(1,"insecure password")
})

const loginStudentSchema = z.object({
    matricNumber: z.string().min(2,"invalid matric number"),
    password: z.string().min(1,"invalid password"),
})


export const SignUpCandidate = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,password} = signupCandidateSchema.parse(req.body);
        const response = await signupCandidate(email,password);
        if(!response){
            return res.json({
                success:false,
                message:"Cannot signup candidate"
            })
        }
        return res.json({
            success:true,
            message:"signup successfull"
        })
    }catch(err){
        return next(err);
    }
}


export const LoginStudent = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {matricNumber,password} = loginStudentSchema.parse(req.body);
        const candidate = await db.Candidate.findOne({where:{matricNumber}});
        console.log(candidate)
        if(!candidate){
            return res.json({
                success:false,
                message:"Invalid student login"
            })
        }

        const isMatched = await compare(password,candidate.password);
        if(!isMatched){
            return res.json({
                success:false,
                message:"invalid matric number/password"
            })
        }
        const token = sign({candidateId:candidate.id},TOKEN_SECRET,{expiresIn:"1d"});
        return res.json({
            success:true,
            data:token
        })
    }catch(err){
        return next(err);
    }
}

export const LoginCandidateUnregistered = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,password} = signupCandidateSchema.parse(req.body);
        const response = await loginUnregisteredCandidate(email,password);

        if(!response || response == null){
            return res.json({
                success:false,
                message:"Cannot login user"
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

export const LoginRegisteredCandidate = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,password} = signupCandidateSchema.parse(req.body);
        const response = await loginRegisteredCandidate(email,password);

        if(!response){
            return res.json({
                success:false,
                mesage:"Cannot login user"
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

export const UpdateCandidate = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId
        console.log(req.body)
        const response = await updateCandidate(candidateId,req.body);
        if(!response){
            return res.json({
                success:false,
                message:"cannot update data"
            })
        }

        return res.json({
            success:true,
            message:"updated successfully"
        })

    }catch(err){
        return next(err);
    }
}

export const GetStudents = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const students = await db.Candidate.findAll({where:{isVerified:true},include:[{model:db.Admission}]});

        return res.json({
            success:true,
            data:students
        })
    }catch(err){
        return next(err);
    }
}

export const GetCandidate = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.params.candidateId;
        const response = await getCandidate(candidateId);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const GetCandidates = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const filter = paramsToObject(req.query);

        const response = await getCandidates(filter);
        
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const Profile = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId;

        const response = await getCandidate(candidateId);

        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const DeleteCandidate = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.params.candidateId;

        const response = await deleteCandidate(candidateId);
        if(!response){
            return res.json({
                success:false,
                message:"Error deleting candidate"
            })
        }
        return res.json({
            success:true,
            message:"Candidate deleted successfully"
        })
    }catch(err){
        return next(err);
    }
}