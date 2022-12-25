import {Router} from "express";
import { AddExaminer, DeleteExaminer, GetExaminer, GetExaminers, LoginAdmin, LoginExaminer, UpdateExaminer } from "../controllers/admin";
import { AcceptAdmission, GetAllAdmissions, GetMyAdmission, RejectAdmission } from "../controllers/admission";
import { CreateCriteria,GetCriteria,GetCriterias,UpdateCriteria,DeleteCriteria } from "../controllers/admissionCriteria";
import { DeleteCandidate, GetCandidate, GetCandidates, GetStudents, LoginCandidateUnregistered, LoginRegisteredCandidate, LoginStudent, Profile, SignUpCandidate, UpdateCandidate } from "../controllers/candidate";
import { AllMyRegisteredCourses, CreateCourse, DeleteCourse, FetchMyAvailableCourses, FetchStudentsWhoIRegistered, FetchStudentsWhoRegisteredMyCourse, GetCourse, GetCourses, RegisterCourse, UnRegisterCourse, UpdateCourse } from "../controllers/course";
import { CreateDepartment, DeleteDepartment, GetDepartment, GetDepartments, UpdateDepartment } from "../controllers/department";
import { AnswerQuestion, CreateExam, CreateExamQuestion, DeleteExam, DeleteQuestion, EndStudentExam, ExitStudentExam, GetAllExams, GetAllStudentsResult, GetExaminerExam, GetExamQuestion, GetExamQuestions, GetMyExamResults, GetQualifiedExams, GetStudentExamQuestions, RegisterStudentForExam, UnRegisterStudentFromExam, UpdateAnswer, UpdateExam, UpdateExamQuestion } from "../controllers/exam";
import { ConfirmRegistrationPayment, GenerateRegistrationFeeDetails, GetMyPayments, GetPayments } from "../controllers/payment";
import { CreateProgram, DeleteProgram, GetProgram, GetPrograms, UpdateProgram } from "../controllers/program";
import { CreateSchool, DeleteSchool, GetSchool, GetSchools, UpdateSchool } from "../controllers/school";
import { CreateSession, DeleteSession, GetSession, GetSessions, UpdateSession } from "../controllers/session";
import { Auth } from "../middlewares";


const router = Router();

// ADMIN
router.post("/admin/login",LoginAdmin);

// ADMISSION CRITERIA
router.post("/criteria",Auth,CreateCriteria);
router.get("/criteria/:criteriaId",Auth,GetCriteria);
router.get("/criterias",Auth,GetCriterias);
router.post("/criteria/edit/:criteriaId",Auth,UpdateCriteria);
router.post("/criteria/delete/:criteriaId",Auth,DeleteCriteria);

// ACADEMIC SESSION
router.post("/academic/session",Auth,CreateSession);
router.get("/academic/session/:sessionId",GetSession);
router.get("/academic/sessions",GetSessions);
router.post("/academic/session/edit/:sessionId",Auth,UpdateSession);
router.post("/academic/session/delete/:sessionId",Auth,DeleteSession);

// SCHOOL
router.post("/school",Auth,CreateSchool);
router.get("/school/:schoolId",GetSchool);
router.get("/schools",GetSchools);
router.post("/school/edit/:schoolId",Auth,UpdateSchool);
router.post("/school/delete/:schoolId",Auth,DeleteSchool);

// DEPARTMENT
router.post("/department/:schoolId",Auth,CreateDepartment);
router.get("/department/:departmentId",GetDepartment);
router.post("/department/edit/:departmentId/:schoolId",Auth,UpdateDepartment);
router.get("/departments",GetDepartments);
router.post("/department/delete/:departmentId",Auth,DeleteDepartment);

// COURSE
router.post("/course/register",Auth,RegisterCourse);
router.post("/course/:departmentId",Auth,CreateCourse);
router.post("/course/unregister/:regCourseId",Auth,UnRegisterCourse);
router.get("/courses/available",Auth,FetchMyAvailableCourses);
router.get("/course/registered",Auth,AllMyRegisteredCourses);
router.get("/course/:courseId",GetCourse);
router.get("/courses",GetCourses);
router.post("/course/edit/:courseId/:departmentId",Auth,UpdateCourse);
router.post("/course/delete/:courseId",Auth,DeleteCourse);

// CANDIDATE
router.post("/candidate/signup",SignUpCandidate);
router.post("/candidate/registered/login",LoginRegisteredCandidate);
router.post("/candidate/unregistered/login",LoginCandidateUnregistered);
router.post("/candidate/update/",Auth,UpdateCandidate);
router.get("/candidate/:candidateId",Auth,GetCandidate);
router.get("/candidates",Auth,GetCandidates);
router.get("/profile",Auth,Profile);
router.post("/candidate/delete/:candidateId",Auth,DeleteCandidate);

// STUDENT
router.post("/student/login",LoginStudent);
router.get("/students",Auth,GetStudents);


// PAYMENTS
router.get("/payment/registration/generate",Auth,GenerateRegistrationFeeDetails);
router.post("/payment/registration/confirm/:paymentId",Auth,ConfirmRegistrationPayment);
router.get("/payments/me",Auth,GetMyPayments);
router.get("/payments",Auth,GetPayments);

// PROGRAMS
router.post("/program",Auth,CreateProgram);
router.post("/program/update",Auth,UpdateProgram);
router.get("/programs",GetPrograms);
router.get("/program/:programId",GetProgram);
router.post("/program/delete/:programId",Auth,DeleteProgram);

// ADMISSION
router.get("/admission/me",Auth,GetMyAdmission);
router.get("/admissions",Auth,GetAllAdmissions);
router.post("/admission/accept/:candidateId",Auth,AcceptAdmission);
router.post("/admission/reject/:candidateId",Auth,RejectAdmission);


// EXAMINER
router.post("/examiner/login",LoginExaminer);
router.post("/examiner/:courseId",Auth,AddExaminer);
router.post("/examiner/edit/:examiner/:courseId",Auth,UpdateExaminer);
router.get("/examiner/:examinerId",Auth,GetExaminer);
router.get("/examiners",Auth,GetExaminers);
router.post("/examiner/delete/:examinerId",Auth,DeleteExaminer);

// EXAM
router.post("/exam/create/:courseId",Auth,CreateExam);
router.post("/exam/update/:examId",Auth,UpdateExam);
router.get("/exams",Auth,GetAllExams);
router.get("/exam/examiner",Auth,GetExaminerExam);
router.post("/exam/delete/:examId",Auth,DeleteExam);
router.get("/exam/students/unregistered",Auth,FetchStudentsWhoRegisteredMyCourse);
router.get("/exam/students/registred",Auth,FetchStudentsWhoIRegistered);

// EXAM QUESTION
router.post("/exam/question/:examId",Auth,CreateExamQuestion);
router.post("/exam/question/update/:questionId",Auth,UpdateExamQuestion);
router.get("/exam/questions",Auth,GetExamQuestions);
router.get("/exam/question/:questionId",Auth,GetExamQuestion)
router.post("/exam/question/delete/:questionId",Auth,DeleteQuestion);

// STUDENT EXAM
router.get("/student/exams",Auth,GetQualifiedExams);
router.post("/exam/student/register/:examId/:candidateId",Auth,RegisterStudentForExam);
router.post("/exam/student/unregister/:registrationId",Auth,UnRegisterStudentFromExam);
router.get("/exam/start/:examId",Auth,GetStudentExamQuestions);
router.post("/exam/end/:examId",Auth,EndStudentExam);
router.post("/exam/stop/:examId",Auth,ExitStudentExam);
router.post("/answer/question/:questionId/:examId/:optionId",Auth,AnswerQuestion);
router.post("/answer/update/:responseId/:optionId",Auth,UpdateAnswer);

// EXAM RESULTS
router.get("/student/exams/result",Auth,GetMyExamResults);
router.get("/examiner/students/result",Auth,GetAllStudentsResult);




export default router;