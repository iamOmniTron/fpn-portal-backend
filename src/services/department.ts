import db from "../database/models";
import { DepartmentCreationAttributes } from "../database/models/department";



export const createDepartment = async (data:DepartmentCreationAttributes & {schoolId:number}):Promise<Boolean>=>{
    try{
        const {schoolId,...rest} = data;
        // @ts-ignore
        const isCreated = await db.Department.create({...rest,SchoolId:schoolId});
        if(!isCreated){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const editDepartment = async (did:number,data:Partial<DepartmentCreationAttributes> & {schoolId:number}):Promise<Boolean>=>{
    try{    
        const {schoolId,...rest} = data;
        // @ts-ignore
        const isUpdated = await db.Department.update({...data,SchoolId:schoolId},{where:{id:did}});
        if(isUpdated[0] <1){
            return false;
        }
        return true
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getDepartment = async (did:number)=>{
    try{
        return await db.Department.findByPk(did,{include:[{model:db.School,required:true,include:[{model:db.Program}]}]});
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getDepartments = async (filter?:{})=>{
    try{
        return await db.Department.findAll({where:{...filter},include:[{model:db.School,required:true,include:[{model:db.Program}]}]});
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const deleteDepartment = async (did:number):Promise<Boolean>=>{
    try{
        const isDeleted = await db.Department.destroy({where:{id:did}});
        if(isDeleted < 1){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}