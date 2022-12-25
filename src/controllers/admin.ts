import "dotenv/config";
import db from "../database/models";
import { Request,Response,NextFunction } from "express";
import {z} from "zod";
import {compare, hash} from "bcrypt";
import { sign } from "jsonwebtoken";

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

const loginSchema = z.object({
    email: z.string().email("invalid email address"),
    password: z.string().min(1,"invalid password"),
})

const createExaminerSchema = z.object({
    email: z.string().email("invalid email address"),
    password: z.string().min(1,"invalid password"),
    fullname: z.string().min(1,"invalid examiner name")
})

export const LoginAdmin = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,password} = loginSchema.parse(req.body);
        const admin = await db.Admin.findOne({where:{email}});
        console.log(admin);
        const isPasswordMatched = await compare(password,admin!.password);
        if(!isPasswordMatched){
            throw new Error("Invalid Login");
        }
        const token = sign({isAdmin:true},TOKEN_SECRET,{expiresIn:"1d"});
        return res.json({
            success:true,
            data:token
        })
    }catch(err){
        return next(err);
    }
}

export const LoginExaminer = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,password} = loginSchema.parse(req.body);
        const examiner = await db.Examiner.findOne({where:{email}});
        if(!examiner){
            return res.json({
                success:false,
                message:"Invalid login"
            })
        }
        const isPasswordMatched = examiner.password === password;
        if(!isPasswordMatched){
            throw new Error("Invalid Login");
        }
        const token = sign({candidateId:examiner.id},TOKEN_SECRET,{expiresIn:"1d"});
        return res.json({
            success:true,
            data:{token,e_id:examiner.id}
        })
    }catch(err){
        return next(err);
    }
}

export const AddExaminer = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const courseId = +(req.params.courseId);
        const {email,password,fullname} = createExaminerSchema.parse(req.body);
        // const hashedPassword = await hash(password,10);
        // @ts-ignore
        const isCreated = await db.Examiner.create({email,fullname,password,CourseId:courseId});
        if(!isCreated){
            return res.json({
                success:false,
                message:"Cannot add examiner"
            })
        }
        // @ts-ignore
        const isExamCreated = await db.Exam.create({active:false,duration:45,ExaminerId:isCreated.id,CourseId:courseId})
        if(!isExamCreated){
            return res.json({
                success:false,
                message:"Cannot add examiner"
            })
        }
        return res.json({
            success:true,
            message:"Examiner added successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const GetExaminers= async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examiners = await db.Examiner.findAll({include:[{model:db.Course,required:true},{model:db.Exam,required:true}]});
        return res.json({
            success:true,
            data:examiners
        })
    }catch(err){
        return next(err);
    }
}

export const GetExaminer = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examinerId = req.params.examinerId;
        const examiner = await db.Examiner.findByPk(examinerId,{include:[{model:db.Course,required:true}]});
        return res.json({
            success:true,
            data:examiner
        })
    }catch(err){
        return next(err);
    }
}

export const UpdateExaminer = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examinerId = req.params.examinerId;
        const courseId = req.params.courseId; 
        // @ts-ignore
        const isUpdated = await db.Examiner.update({CourseId:courseId,...req.body},{where:{id:examinerId}});
        if(isUpdated[0] <1){
            return res.json({
                success:false,
                message:"Cannot update examiner"
            })
        }

        return res.json({
            success:true,
            message:"Examiner updated successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const DeleteExaminer = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examinerId = req.params.examinerId;
        // @ts-ignore
        const isUpdated = await db.Examiner.destroy({where:{id:examinerId}});
        if(isUpdated < 1){
            return res.json({
                success:false,
                message:"Cannot delete examiner"
            })
        }

        return res.json({
            success:true,
            message:"Examiner deleted successfully"
        })
    }catch(err){
        return next(err);
    }
}
