import db from "../database/models";
import { AdmissionCriteriaCreationAttributes } from "../database/models/admission_criteria";
const {AdmissionCriteria} = db;


export const createCriteria = async(data:Partial<AdmissionCriteriaCreationAttributes>):Promise<Boolean>=>{
    try {
        const isCreated = await AdmissionCriteria.create({...data});
        if(!isCreated) return false;
        return true;
    } catch (error) {
        console.log(error);
        throw new Error((error as Error).message);
    }
}

export const editCriteria = async(criteriaId:number,data:Partial<AdmissionCriteriaCreationAttributes>):Promise<Boolean>=>{
    try{
        const updated = await AdmissionCriteria.update({...data},{where:{id:criteriaId}});
        if(updated[0] < 1) return false;
        return true; 
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getCriteria = async (criteriaId:number)=>{
   try{
        return await AdmissionCriteria.findByPk(criteriaId);
   }catch(err){
    throw new Error((err as Error).message);
   }
}

export const getCriterias = async (filters?:Partial<AdmissionCriteriaCreationAttributes>)=>{
    try{
        return AdmissionCriteria.findAll({where:{...filters}});
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const deleteCriteria = async (criteriaId:number):Promise<Boolean>=>{
    try{
        const deleted = await AdmissionCriteria.destroy({where:{id:criteriaId}});
        if(deleted <1) return false;
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}