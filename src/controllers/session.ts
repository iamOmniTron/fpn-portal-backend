import {Request,Response,NextFunction} from "express";
import {z} from "zod";
import { paramsToObject } from "../helpers/utils";
import { createSession, deleteSession, getSession, getSessions, updateSession } from "../services/session";

const createSessionSchema = z.object({
    active: z.boolean(),
    startYear: z.number().min(4,"start year must be a valid year").gt(1000,"start year is out of range"),
    endYear : z.number().min(4,"end year must be a valid year").gt(1000,"end year is out of range")
})

const updateSessionType = createSessionSchema.partial();

export const CreateSession = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const data = createSessionSchema.parse(req.body);
        const response = await createSession(data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot create session"
            })
        }

        return res.json({
            success:true,
            message:"success created successfully"
        })
    }catch(err){    
        return next(err)
    }
}

export const UpdateSession = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const sessionId = +(req.params.sessionId);
        const data = updateSessionType.parse(req.body);
        const response = await updateSession(sessionId,data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot update session"
            })
        }

        return res.json({
            success:true,
            message:"session updated successfully"
        })

    }catch(err){
        return next(err)
    }
}

export const GetSession = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const sessionId = +(req.params.sessionId);
        const response = await getSession(sessionId);

        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err)
    }
}

export const GetSessions = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const params = paramsToObject(req.query);

        const response = await getSessions(params);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err)
    }
}

export const DeleteSession = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const sessionId = +(req.params.sessionId);
        const response = await deleteSession(sessionId);
        if(!response){
            return res.json({
                success:false,
                message:"cannot delete session"
            })
        }

        return res.json({
            success:true,
            message:"session deleted successfully"
        })
    }catch(err){
        return next(err)
    }
}