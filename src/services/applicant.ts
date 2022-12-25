import db from "../database/models";
import { ApplicantCreationAttributes } from "../database/models/applicant";
const {Applicant} = db;



export const createApplicant = async (data:ApplicantCreationAttributes):Promise<Boolean>=>{
    try{
        const isCreated = await Applicant.create({...data});
        if(!isCreated){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}

export const getApplicant = async (applicantId:string)=>{
    try{
        const applicant =  await Applicant.findByPk(applicantId);
        if(!applicant){
            return null;
        }

        return applicant;
    }catch(err){
        throw new Error((err as Error).message)
    }
}


export const getApplicants = async ()=>{
    try{
        const applicants = await Applicant.findAll();

        return applicants;
    }catch(err){
        throw new Error((err as Error).message)
    }
}

export const editApplicant = async (applicantId:string,data:Partial<ApplicantCreationAttributes>):Promise<Boolean>=>{
    try{
        const isUpdated = await Applicant.update({...data},{where:{id:applicantId}});
        if(!isUpdated){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message)
    }
}

export const deleteApplicant = async (applicantId:string):Promise<Boolean>=>{
    try{
        const isDeleted = await Applicant.destroy({where:{id:applicantId}});
        if(!isDeleted){
            return false;
        }
        return true;
    }catch(err){
        throw new Error((err as Error).message);
    }
}