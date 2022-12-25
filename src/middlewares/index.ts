import "dotenv/config";
import { Request,Response,NextFunction } from "express";
import { verify } from "jsonwebtoken";
import db from "../database/models";

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;



export const Auth = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const header = req.headers["authorization"] as string;
        if(!header){
            return next("unauthenticated");
        }
        const token = header.split(" ")[1];
        if(!token || typeof token !== "string"){
            return next("unauthenticated");
        }
        const payload= verify(token,TOKEN_SECRET);
        // @ts-ignore
        const {candidateId} = payload;
        // @ts-ignore
        if(payload!.isAdmin){
            return next();
        }
        const examiner = await db.Examiner.findByPk(candidateId);
        if(examiner){
            req.userId = examiner.id;
            return next();
        }
        const candidate = await db.Candidate.findByPk(candidateId);
        if(!candidate){
            return next("unauthenticated");
        }
        req.userId = candidateId;
        return next();
    }catch(err){
        return next(err);
    }
}

export const RequireAdmin = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const header = req.headers["authorization"] as string;
        const token = header.split(" ")[1];
        if(!token || typeof token !== "string"){
            return next("unauthenticated");
        }
        const payload= verify(token,TOKEN_SECRET);
        // @ts-ignore
        const {isAdmin} = payload;
        if(!isAdmin){
            return next("unauthorized to make request")
        }
        return next();
    }catch(err){
        return next(err);
    }
}