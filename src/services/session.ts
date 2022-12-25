import db from "../database/models";
import { SessionCreationAttributes } from "../database/models/session";

export const createSession = async (data:SessionCreationAttributes):Promise<Boolean>=>{
    try{
        const session = await db.Session.create({...data});
        if(!session){
            return false;
        }
        return true;
    }catch(err){    
        throw new Error((err as Error).message);
    }
}

export const updateSession = async (sessionId:number,data:Partial<SessionCreationAttributes>):Promise<Boolean>=>{
    try{
        const updated = await db.Session.update({...data},{where:{id:sessionId}});
        if(updated[0] < 1){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getSession = async (sessionId:number)=>{
    try{
        console.log(sessionId)
        return await db.Session.findByPk(sessionId);
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getSessions = async (filter?:Partial<SessionCreationAttributes> | {})=>{
    try{
        return await db.Session.findAll({where:{...filter}});
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const deleteSession = async (sessionId:number):Promise<Boolean>=>{
    try{
        const isDeleted = await db.Session.destroy({where:{id:sessionId}});
        if(isDeleted<1){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}