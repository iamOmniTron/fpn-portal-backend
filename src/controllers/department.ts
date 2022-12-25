import { Request,Response,NextFunction } from "express";
import {z} from "zod";
import { paramsToObject } from "../helpers/utils";
import { createDepartment, deleteDepartment, editDepartment, getDepartment, getDepartments } from "../services/department";

const createDepartmentSchema = z.object({
    name:z.string().min(1,"invalid department name"),
    totalCreditUnit: z.number(),
    schoolId: z.number(),
})


export const CreateDepartment = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const schoolId = +(req.params.schoolId);
        const data = createDepartmentSchema.parse({...req.body,schoolId});
        const response = await createDepartment(data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot create department"
            })
        }
        return res.json({
            success:true,
            message:"department created successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const UpdateDepartment = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const departmentId = +(req.params.departmentId);
        const schoolId = +(req.params.schoolId);
        const data = createDepartmentSchema.parse({...req.body,schoolId});
        const response = await editDepartment(departmentId,data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot update department"
            })
        }

        return res.json({
            success:true,
            message:"department successfully"
        })
    }catch(err){
        return next(err);
    }
} 

export const GetDepartment = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const departmentId = +(req.params.departmentId);
        const response = await getDepartment(departmentId);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}


export const GetDepartments = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const params = paramsToObject(req.query);
        const response = await getDepartments(params);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const DeleteDepartment = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const departmentId = +(req.params.departmentId);
        const response = await deleteDepartment(departmentId);
        if(!response){
            return res.json({
                success:false,
                message:"cannot delete department"
            })
        }
        return res.json({
            success:true,
            message:"department deleted successfully"
        })
    }catch(err){
        return next(err);
    }
}