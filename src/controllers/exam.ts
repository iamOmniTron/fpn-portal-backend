import "dotenv/config";
import {Request,Response,NextFunction} from "express";
import db from "../database/models";
import {z} from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Question } from "../database/models/question";
import { randomizeArray } from "../helpers/utils";

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

const createExamSchema = z.object({
    active:z.boolean(),
    duration:z.number(),
    deadline:z.date()
})

const optionsSchema = z.object({
    text:z.string().min(1,"invalid option"),
    isAnswer: z.boolean()
})

const createExamQuestionSchema = z.object({
    text:z.string().min(1,"invalid quesion"),
    options: z.array(optionsSchema),
})
const loginSchema = z.object({
    matricNumber: z.string().min(1,"invalid matric number"),
    password: z.string().min(1,"invalid password")
})

export const LoginExamStudent =async (req:Request,res:Response,next:NextFunction) => {
    try{
        const {matricNumber,password} = loginSchema.parse(req.body);
        const student = await db.Candidate.findOne({where:{matricNumber}});
        if(!student){
            return res.json({
                success:false,
                message:"Invalid matric number/password"
            });
        }
        const isMatched = await compare(password,student.password);
        if(!isMatched){
            return res.json({
                success:false,
                message:"Invalid Login Details"
            })
        }
        const token = sign({candidateId:student.id},TOKEN_SECRET,{expiresIn:"1d"});
        return res.json({
            success:true,
            data:token
        })
        
    }catch(err){
        return next(err);
    }
}

export const CreateExam = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {duration,active,deadline} = createExamSchema.parse(req.body);
        const courseId = +(req.params.courseId);
        // @ts-ignore
        const isCreated = await db.Exam.create({active,duration,CourseId:courseId,deadline});
        if(!isCreated){
            return res.json({
                success:false,
                message:"cannot create exam"
            })
        }
        return res.json({
            success:true,
            message:"Exam created successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const GetAllExams = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const exams = await db.Exam.findAll({include:[{model:db.Examiner,attributes:["email"],required:true}]});
        return res.json({
            success:true,
            data:exams
        })
    }catch(err){
        return next(err);
    }
}

export const GetExaminerExam = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examinerId = req.userId;
        // @ts-ignore
        const exams = await db.Exam.findOne({where:{ExaminerId:examinerId},include:[{model:db.Question},{model:db.Examiner},{model:db.Course}]});
        return res.json({
            success:true,
            data:exams
        })
    }catch(err){
        return next(err);
    }
}


export const GetQualifiedExams = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const studentId = req.userId;

        // @ts-ignore
        const exams = await db.RegisteredExamStudent.findAll({where:{CandidateId:studentId},include:[{model:db.Exam,where:{active:true},include:[{model:db.Course}]}]});

        return res.json({
            success:true,
            data:exams
        })
    }catch(err){
        return next(err);
    }
}


export const UpdateExam = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examId = +(req.params.examId);
        const isEdited = await db.Exam.update({...req.body},{where:{id:examId}});
        if(isEdited[0] <1){
            return res.json({
                success:false,
                message:"cannot update exam"
            })
        }
        return res.json({
            success:true,
            message:"exam updated successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const DeleteExam = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examId = +(req.params.examId);
        const isDeleted = await db.Exam.destroy({where:{id:examId}});
        if(isDeleted <1){
            return res.json({
                success:false,
                message:"cannot deleted exam"
            })
        }
        return res.json({
            success:true,
            message:"exam deleted successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const CreateExamQuestion = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        console.log(req.body.options)
        const examId = +(req.params.examId);
        const {text,options} = createExamQuestionSchema.parse(req.body);
        // @ts-ignore
        const isCreated = await db.Question.create({text,ExamId:examId});
        if(!isCreated){
            return res.json({
                success:false,
                message:"Cannot create question"
            })
        }
        let newOptions = [];
        for(let i =0; i < options.length; i++){
            newOptions.push({...options[i],QuestionId:isCreated.id});
        }
        // @ts-ignore
        const isOptionsAdded = await db.Option.bulkCreate(newOptions);
        if(!isOptionsAdded){
            return res.json({
                success:false,
                message:"Cannot add options for question"
            })
        }
        return res.json({
            success:true,
            message:"Question created successfully"
        })
    }catch(err){
        return next(err);
    }
}


export const UpdateExamQuestion = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const questionId = +(req.params.questionId);
        const isUpdated = await db.Question.update({...req.body},{where:{id:questionId}});
        if(isUpdated[0] <1){
            return res.json({
                success:false,
                message:"cannot update question"
            })
        }
        return res.json({
            success:true,
            message:"question updated successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const GetExamQuestion = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const questionId = +(req.params.questionId);
        // @ts-ignore
        // const question = await db.Option.findAll({where:{QuestionId:questionId},include:[{model:db.Question}]})
        const question = await db.Question.findByPk(questionId,{include:[{model:db.Option}]})
        return res.json({
            success:true,
            data:question
        })
    }catch(err){
        return next(err);
    }
}

export const GetExamQuestions = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examinerId = req.userId;
        // @ts-ignore
        const questions = await Question.findAll({include:[{model:db.Exam,where:{ExaminerId:examinerId}},{model:db.Option}]});
        return res.json({
            success:true,
            data:questions
        })
    }catch(err){
        return next(err);
    }
}

export const RegisterStudentForExam = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.params.candidateId;
        const examId = +(req.params.examId);
        // @ts-ignore
        const isCreated = await db.RegisteredExamStudent.create({CandidateId:candidateId,ExamId:examId});

        if(!isCreated){
            return res.json({
                success:false,
                message:"student registered unsuccessful"
            })
        }
        return res.json({
            success:true,
            message:"student registered successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const UnRegisterStudentFromExam = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const registrationId = +(req.params.registrationId);

        const isDeleted = await db.RegisteredExamStudent.destroy({where:{id:registrationId}});
        if(isDeleted < 1){
            return res.json({
                success:false,
                message:"cannot unregister student"
            })
        }
        return res.json({
            success:true,
            message:"student registered successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const GetStudentExamQuestions = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examId = +(req.params.examId);
        const candidateId = req.userId;
        console.log(examId);
        // @ts-ignore
        const q = await db.StudentExam.findAll({where:{ExamId:examId,CandidateId:candidateId}});
        if(q.length > 0){
            return res.json({
                success:false,
                message:"exam taken already"
            })
        }
        // @ts-ignore
        const isCreated = await db.StudentExam.create({CandidateId:candidateId,ExamId:examId,taken:true,submitted:false,ended:false});
        if(!isCreated){
            return res.json({
                success:false,
                message:"cannot fetch questions"
            })
        }
        // @ts-ignore
        const qs: Exam & Array<Question> | null = await db.Exam.findOne({where:{id:examId},include:[{model:db.Question,include:[{model:db.Option}]},{model:db.Course}]});
        if(!qs || qs === null){
            return res.json({
                success:false,
                message:"Exam Questions not ready"
            })
        }
        // @ts-ignore
        const questions = qs.Questions;
        let shuffledOptionsQuestions = []
        for (let index = 0; index < questions.length; index++) {
            // @ts-ignore
            questions[index].Options = randomizeArray(questions[index].Options);
            shuffledOptionsQuestions.push(questions[index]);
        }
        const shuffledQuestions = randomizeArray(shuffledOptionsQuestions);
        qs.Questions = shuffledQuestions;
        

        return res.json({
            success:true,
            data:qs
        })
    }catch(err){
        return next(err);
    }
}

export const ExitStudentExam = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const studentId = req.userId;
        const examId = +(req.params.examId);
        // @ts-ignore
        const isUpdated = await db.StudentExam.update({ended:true,submitted:false,taken:true},{where:{CandidateId:studentId,ExamId:examId}});
        if(isUpdated[0] < 1) return res.json({success:false,message:"cannot end exam"});
        return res.json({
            success:true,
            message:"exam ended successfully"
        });
    }catch(err){
        return next(err);
    }
}

export const EndStudentExam = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const studentId = req.userId;
        const examId = +(req.params.examId);
        console.log(examId);
        // @ts-ignore
        const isUpdated = await db.StudentExam.update({ended:true,submitted:true,taken:true},{where:{CandidateId:studentId,ExamId:examId}});
        if(isUpdated[0] < 1) return res.json({success:false,message:"cannot end exam"});
        return res.json({
            success:true,
            message:"exam ended successfully"
        });
    }catch(err){
        return next(err);
    }
}

export const DeleteQuestion = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const questionId = +(req.params.questionId);
        const isDeleted = await db.Question.destroy({where:{id:questionId}});
        if(isDeleted <1){
            return res.json({
                success:false,
                message:"cannot deleted question"
            })
        }
        return res.json({
            success:true,
            message:"question deleted successfully"
        })
    }catch(err){
        return next(err);
    }
}

export const AnswerQuestion = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examId = +(req.params.examId);
        const optionId = +(req.params.optionId)
        const questionId = +(req.params.questionId)
        const candidateId = req.userId;
        // console.log(examId,optionId,questionId)
        console.log("exam id",examId);
        console.log("optionId",optionId);
        console.log("questionId",questionId);
        // @ts-ignore
        const studentExams = await db.StudentExam.findAll({where:{CandidateId:candidateId,ExamId:examId}});
        if(!studentExams){
            return res.json({
                success:false,
                message:"error answering question"
            })
        }
        // @ts-ignore
        const answered = await db.StudentResponse.create({CandidateId:candidateId,StudentExamId:studentExams[0].id,OptionId:optionId,QuestionId:questionId});
        if(!answered){
            return res.json({
                success:false,
                message:"error answering question"
            })
        }
        return res.json({
            success:true,
            message:"answer successfull",
            data:answered.id
        })
    }catch(err){
        return next(err);
    }
}

export const GetMyExamResults = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const candidateId = req.userId;
        // @ts-ignore
        const examsResult = await db.StudentExam.findAll({where:{CandidateId:candidateId,ended:true},attributes:[[db.Sequelize.fn("COUNT",db.Sequelize.col("StudentResponses.id")),"total"]],include:[{model:db.Exam,attributes:[[db.Sequelize.fn("COUNT",db.Sequelize.col("StudentResponses.id")),"total"]],include:[{model:db.Course}]},{model:db.StudentResponse,include:[{model:db.Option,where:{isAnswer:true},required:true}]}],group:["StudentExam.id"]});

        return res.json({
            success:true,
            data:examsResult
        })
    }catch(err){
        return next(err);
    }
}

export const GetAllStudentsResult =  async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const examinerId = req.userId;
        // @ts-ignore
        const questions = await db.Question.count({include:[{model:db.Exam,where:{ExaminerId:examinerId}}]});
        // @ts-ignore
        const results = await db.StudentExam.findAll({attributes:[[db.Sequelize.fn("COUNT",db.Sequelize.col("StudentResponses.id")),"total"]],include:[{model:db.Exam,where:{ExaminerId:examinerId}},{model:db.Candidate,include:[{model:db.Admission,include:[{model:db.Department}]}]},{model:db.StudentResponse,include:[{model:db.Option,where:{isAnswer:true}}]}],group:["Candidate.id"]})

        return res.json({
            success:true,
            data:{
                total:questions,
                results
            }
        })
    }catch(err){
        return next(err);
    }
}

export const UpdateAnswer = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const optionId = +(req.params.optionId);
        const responseId = +(req.params.responseId);

        // @ts-ignore
        const isUpdated = await db.StudentResponse.update({OptionId:optionId},{where:{id:responseId}});
        if(!isUpdated){
            return res.json({
                success:false,
                message:"unable to update answer"
            })
        }

        return res.json({
            success:true,
            message:"answer updated successfully"
        })
    }catch(err){
        return next(err);
    }
}