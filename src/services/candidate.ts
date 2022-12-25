import "dotenv/config";
import {compare, hash} from "bcrypt"
import { sign } from "jsonwebtoken";
import db from "../database/models";
import { CandidateCreationAttributes } from "../database/models/candidate";
const {Candidate} = db;
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

export const signupCandidate = async (email:string,password:string):Promise<Boolean>=>{
    try{
        const existingUser = await Candidate.findOne({where:{email}});
        if(existingUser){
            throw new Error("candidate signed up already");
        }
        const hashedPassword = await hash(password,10);
        const isSaved = await Candidate.create({email,password:hashedPassword,isVerified:false});
        if(!isSaved){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const loginUnregisteredCandidate = async (email:string,password:string):Promise<string|null>=>{
    try{
        const candidate = await Candidate.findOne({where:{email,isVerified:false}});
        console.log(candidate)
        if(!candidate){
            throw new Error("Invalid Login")
        }
        const isPasswordMatched = await compare(password,candidate.password);
         if(!isPasswordMatched){
            throw new Error("Invalid Login Details")
         }
        const token = sign({candidateId:candidate.id},TOKEN_SECRET,{expiresIn:"1d"});
        return token;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const loginRegisteredCandidate = async (email:string,password:string):Promise<string|null>=>{
    try{
        const candidate = await Candidate.findOne({where:{email,isVerified:true}});
        if(!candidate){
            throw new Error("Invalid Login")
        }
        const token = sign({candidateId:candidate.id},TOKEN_SECRET,{expiresIn:"1d"});
        return token;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const updateCandidate = async (candidateId:string,data:CandidateCreationAttributes & {details:string,department:string,programId:number}):Promise<Boolean>=>{
    try{
        const {details,department,programId,...rest} = data
        const isCreated = await Candidate.update({...rest},{where:{id:candidateId}});
        console.log(isCreated);
        if(!isCreated){
            return false;
        }
        // @ts-ignore
        const admission = await db.Admission.create({details,DepartmentId:department,CandidateId:candidateId,ProgramId:1});
        console.log("here1")
        if(!admission){
            return false;
        }
        console.log("here2");
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const deleteCandidate = async (candidateId:string):Promise<Boolean>=>{
    try{
        const isDeleted = await Candidate.destroy({where:{id:candidateId}});
        if(!isDeleted){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getCandidate = async (candidateId:string)=>{
    try{
        
        const candidate = await Candidate.findByPk(candidateId,{include:[{model:db.Admission,required:true}]});
        if(!candidate){
            return null;
        }
        return candidate;

    }catch(err){
        throw new Error((err as Error).message)
    }
}

export const getCandidates = async (filter:{})=>{
    try{
        const candidates = await Candidate.findAll({where:{...filter},include:[{model:db.Admission,required:true}]});
        return candidates;
    }catch(err){
        throw new Error((err as Error).message)
    }
}