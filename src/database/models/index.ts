import { AdmissionCriteria } from "./admission_criteria";
import { Applicant } from "./applicant";
import { Candidate } from "./candidate";
import { Course } from "./course";
import { Payment } from "./payment";
import {Program} from "./program";
import { Session } from "./session";
import { Department } from "./department";
import { School } from "./school";
import { Admission } from "./admission";
import { Level } from "./level";
import { Admin } from "./admin";
import { RegisteredCourse } from "./registeredCourse";
import { StudentResponse } from "./studentResponse";
import { StudentExam } from "./studentExam";
import { Exam } from "./exam";
import { Question } from "./question";
import {Examiner} from "./examiner";
import { Option } from "./options";
import sequelize from "../dbconfigs/config";
import {Sequelize} from "sequelize";
import { RegisteredExamStudent } from "./registredExamStudents";


const models = {Session,Examiner,RegisteredExamStudent,Level,StudentResponse,Exam,StudentExam,RegisteredCourse,Admin,Course,Department,School,Admission,Payment,Question,Option,Program,AdmissionCriteria,Applicant,Candidate
};

Object.values(models).forEach((model:any)=>{
    if(model.associate){
        model.associate(models);
    }
})

const db = {
    ...models,sequelize,Sequelize,
};

export default db;