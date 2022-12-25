import { Request,Response,NextFunction } from "express";
import {z} from "zod";
import { paramsToObject } from "../helpers/utils";
import { createCourse, deleteCourse, getCourse, getCourses, updateCourse } from "../services/course";
import { Op } from "sequelize";
import db from "../database/models";
import { Course } from "../database/models/course";


const createCourseSchema = z.object({
    code:z.string().min(3,"invalid course code"),
    title: z.string().min(3,"invalid course title"),
    unit: z.number().gte(1,"invalid course creadit unit"),
    level:z.string().min(1,"inappropriate level"),
    type: z.enum(["General","Departmental"]),
    departmentId: z.number().min(1,"invalid department selected"),
    semester: z.number(),
})

const courseIdSchema = z.object({
    courseId: z.number().min(1,"invalid course id")
})


export const FetchStudentsWhoRegisteredMyCourse = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examinerId = req.userId;
        // @ts-ignore
        const students = await db.Candidate.findAll({where:{isVerified:true},include:[{model:db.Admission,include:[{model:db.Department}]},{model:db.RegisteredCourse,include:[{model:db.Course,required:true,include:[{model:db.Examiner,where:{id:examinerId},include:[{model:db.Exam}]}]}]}]});

        return res.json({
            success:true,
            data:students
        })
    }catch(err){
        return next(err);
    }
}

export const FetchStudentsWhoIRegistered = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examinerId = req.userId;
        // @ts-ignore
        const students = await db.RegisteredExamStudent.findAll({include:[{model:db.Candidate,include:[{model:db.Admission,required:true,include:[{model:db.Department}]}]},{model:db.Exam,where:{ExaminerId:examinerId}}]});

        return res.json({
            success:true,
            data:students
        });
    }catch(err){
        return next(err);
    }
}

export const FetchMyAvailableCourses = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId;
        // @ts-ignore
        const admission = await db.Admission.findOne({where:{CandidateId:candidateId},include:[{model:db.Department}]});
        // @ts-ignore
        const registeredCourses = await db.RegisteredCourse.findAll({where:{CandidateId:candidateId}});

        console.log(registeredCourses);

        let coursesList:Array<number> = [];
        registeredCourses.forEach((c)=>{
            // @ts-ignore
            coursesList.push(c.CourseId);
        })

        const availableCourses:Array<Course> = await db.Course.findAll({where:{
                id:{
                    [Op.notIn]:coursesList
                },
                [Op.or]:[
                    // @ts-ignore
                    {DepartmentId:admission.DepartmentId},
                    {type:"General"}
                ]
        },include:[{model:db.Department,required:false}]})
        return res.json({
            success:true,
            data:availableCourses
        })
    }catch(err){
        return next(err)
    }
}

export const RegisterCourse = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId;
        const {courseId} = courseIdSchema.parse(req.body);
        // @ts-ignore
        const registeredCourse = await db.RegisteredCourse.create({CandidateId:candidateId,CourseId:courseId});

        if(!registeredCourse){
            return res.json({
                success:false,
                message:"cannot registered course"
            })
        }

        return res.json({
            success:true,
            message:"course registered successfully"
        })
        
    }catch(err){
        return next(err);
    }
}

export const UnRegisterCourse = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const regCourseId = +(req.params.regCourseId);
        const isDeleted = await db.RegisteredCourse.destroy({where:{id:regCourseId}});
        if(isDeleted <1){
            return res.json({
                success:false,
                message:"cannot unregister course"
            })
        }

        return res.json({
            success:true,
            message:"Course un-registered successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const AllMyRegisteredCourses = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId;
        // @ts-ignore
        const courses = await db.RegisteredCourse.findAll({where:{CandidateId:candidateId},include:[{model:db.Course,required:true}]});

        return res.json({
            success:true,
            data:courses
        })
    }catch(err){
        return next(err);
    }
}

export const CreateCourse = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const departmentId = +(req.params.departmentId);
        const data = createCourseSchema.parse({...req.body,departmentId});
        const response = await createCourse(data);
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

export const UpdateCourse = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const courseId = +(req.params.courseId);
        const departmentId = +(req.params.departmentId);
        const data = createCourseSchema.parse({...req.body,departmentId});
        const response = await updateCourse(courseId,data);
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

export const GetCourse = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const courseId = +(req.params.courseId);
        const response = await getCourse(courseId);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const GetCourses = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const params = paramsToObject(req.query);
        const response = await getCourses(params);
        return res.json({
            success:true,
            data:response
        })
    }catch(err){
        return next(err);
    }
}

export const DeleteCourse = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const courseId = +(req.params.courseId);
        const response = await deleteCourse(courseId);
        if(!response){
            return res.json({
                success:false,
                message:"cannot delete course"
            })
        }

        return res.json({
            success:true,
            message:"coourse deleted successfully"
        })
    }catch(err){
        return next(err);
    }
}