import db from "../database/models";
import { School, SchoolCreationAttributes } from "../database/models/school";


export const createSchool = async (data:SchoolCreationAttributes & {programId:number}):Promise<Boolean>=>{
    try{
        const {programId,...rest} = data;
        // @ts-ignore
        const isCreated = await db.School.create({...rest,ProgramId:programId});
        if(!isCreated){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const editSchool = async (sid:number,data:Partial<SchoolCreationAttributes>):Promise<Boolean>=>{
    try{    
        const isUpdated = await db.School.update({...data},{where:{id:sid}});
        if(isUpdated[0] <1){
            return false;
        }
        return true
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getSchool = async(sid:number)=>{
    try{
        return await db.School.findByPk(sid,{include:[{model:db.Program}]});
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getSchools = async (filter?:Partial<SchoolCreationAttributes> | {})=>{
    try{
        return await db.School.findAll({where:{...filter},include:[{model:db.Program}]});
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const deleteSchool = async (sid:number):Promise<Boolean>=>{
    try{
        const isDeleted = await db.School.destroy({where:{id:sid}});
        if(!isDeleted){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}