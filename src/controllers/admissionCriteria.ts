import {Request,Response,NextFunction} from "express";
import {z} from "zod";
import { paramsToObject } from "../helpers/utils";
import { createCriteria, deleteCriteria, editCriteria, getCriteria, getCriterias } from "../services/admissionCriteria";


const createCriteriaSchema = z.object({
    merit: z.boolean(),
    catchment: z.boolean(),
    ssceResult: z.boolean(),
    ndResult: z.boolean()
})

const partialCriteriaType = createCriteriaSchema.partial()



export const CreateCriteria = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const data = createCriteriaSchema.parse(req.body);
        const response = await createCriteria(data);
        if(!data){
            return res.json({
                success:false,
                message:"Cannot create criteria"
            })
        }
        return res.json({
            success:true,
            message:"criteria created successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const UpdateCriteria = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const criteriaId = +(req.body.criteriaId)
        const data = partialCriteriaType.parse(req.body);
        const response = await editCriteria(criteriaId,data);
        if(!response){
            return res.json({
                success:false,
                message:"cannot update criteria"
            })
        }

        return res.json({
            success:true,
            message:"criteria updated successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const GetCriteria = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const criteriaId = +(req.params.criteriaId);
        const response = await getCriteria(criteriaId);

        return res.json({
            sucess:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const GetCriterias = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const params = paramsToObject(req.query.toString());
        const response = await getCriterias(params);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const DeleteCriteria = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const criteriaId = +(req.params.criteriaId);
        const response = await deleteCriteria(criteriaId);
        if(!response){
            return res.json({
                success:false,
                message:"cannot delete criteria"
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