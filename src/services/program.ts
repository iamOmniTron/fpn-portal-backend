import db from "../database/models";
import { ProgramCreationAttributes } from "../database/models/program";

const {Program} = db;

export const createProgram = async (data:ProgramCreationAttributes):Promise<Boolean>=>{
    try{
        
        const isCreated = await Program.create({...data});
        if(!isCreated){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const updateProgam = async (programId:number,data:Partial<ProgramCreationAttributes>):Promise<Boolean>=>{
    try{
        const isUpdated = await Program.update({...data},{where:{id:programId}});
        if(isUpdated[0] <1) return false;
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getProgram = async (programId:number)=>{
    try{
        return await Program.findByPk(programId,{include:[{model:db.AdmissionCriteria}]});
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getPrograms = async ()=>{
    try{
        return await Program.findAll({include:[{model:db.AdmissionCriteria}]})
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const deleteProgram = async (programId:number):Promise<Boolean>=>{
    try{
        const deleted = await Program.destroy({where:{id:programId}});
        if(deleted <1){
            return false
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}