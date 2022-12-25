import db from "../database/models";
import { CourseCreationAttributes } from "../database/models/course";


export const createCourse = async (data:CourseCreationAttributes & {departmentId:number}):Promise<Boolean>=>{
    try{
        const {departmentId,...rest} = data;
        // @ts-ignore
        const isCreated = await db.Course.create({...rest,DepartmentId:departmentId});
        if(!isCreated) return false;
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const updateCourse = async (cid:number,data:Partial<CourseCreationAttributes> & {departmentId:number}):Promise<Boolean>=>{
    try{
        const {departmentId,...rest} = data;
        // @ts-ignore
        const isUpdated = await db.Course.update({...rest,DepartmentId:departmentId},{where:{id:cid}});
        if(isUpdated[0] <1) return false;
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getCourse = async (cid:number)=>{
    try{
        return await db.Course.findByPk(cid,{include:[{model:db.Department,include:[{model:db.School}]}]});
    }catch(err){
        throw new Error((err as Error).message);
    }
}


export const getCourses = async (filter:Partial<CourseCreationAttributes>)=>{
    try{
        return await db.Course.findAll({where:{...filter},include:[{model:db.Department,include:[{model:db.School}]}]})
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const deleteCourse = async (cid:number)=>{
    try{
        const isDeleted = await db.Course.destroy({where:{id:cid}});
        if(isDeleted < 1)return false;
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}