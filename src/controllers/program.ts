import {Request,Response,NextFunction} from "express";
import {z} from "zod";
import { paramsToObject } from "../helpers/utils";
import { createProgram, deleteProgram, getProgram, getPrograms, updateProgam } from "../services/program";

const createProgramSchema = z.object({
    name: z.string().min(1,"invalid program name"),
    duration: z.number().gte(1,"duration must take atleast a year"),
})

const updateProgramSchema = createProgramSchema.partial();


export const CreateProgram = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const data = createProgramSchema.parse(req.body);
        const response = await createProgram(data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot create this program"
            })
        }

        return res.json({
            success:true,
            message:"program created successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const UpdateProgram = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const programId = +(req.params.programId);
        const data = updateProgramSchema.parse(req.body);
        const response = await updateProgam(programId,data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot update program at the moment"
            })
        }
        return res.json({
            success:true,
            message:"program updated successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const GetProgram = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const programId = +(req.params.programId);
        const response = await getProgram(programId);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}


export const GetPrograms = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const response = await getPrograms();
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const DeleteProgram = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const programId = +(req.params.programId);
        const response = await deleteProgram(programId);
        if(!response){
            return res.json({
                success:false,
                message:"cannot delete program"
            })
        }

        return res.json({
            success:true,
            message:"program deleted successfully"
        })
    }catch(err){
        return next(err);
    }
}