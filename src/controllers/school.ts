import {Request,Response,NextFunction} from "express";
import {z} from "zod";
import { paramsToObject } from "../helpers/utils";
import { createSchool, deleteSchool, editSchool, getSchool, getSchools } from "../services/school";

const createSchoolSchema = z.object({
    name:z.string().min(1,"name of faculty cannot be empty"),
    programId:z.number().min(1,"invalid program id"),
})


export const CreateSchool = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const data = createSchoolSchema.parse(req.body);
        const response = await createSchool(data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot create school"
            })
        }
        return res.json({
            success:true,
            message:"school created successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const GetSchool = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const schoolId = +(req.params.schoolId);
        const response = await getSchool(schoolId);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const UpdateSchool = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const schoolId = +(req.params.schoolId);
        const data = createSchoolSchema.partial().parse(req.body);
        const response = await editSchool(schoolId,data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot update school"
            })
        }

        return res.json({
            success:true,
            message:"school updated successfully"
        })
    }catch(err){
        return next(err);
    }
} 

export const GetSchools = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const params = paramsToObject(req.query);

        const response = await getSchools(params);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const DeleteSchool = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const schoolId = +(req.params.schoolId);
        const response = await deleteSchool(schoolId);

        if(!response){
            return res.json({
                success:false,
                message:"cannot delete school"
            })
        }

        return res.json({
            success:true,
            message:"school deleted successfully"
        })
    }catch(err){
        return next(err);
    }
}