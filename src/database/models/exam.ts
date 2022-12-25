import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


interface ExamAttributes{
    id:number;
    active:boolean;
    duration?:number;
    deadline?:Date;
}


export interface ExamCreationAttributes extends Optional<ExamAttributes,"id">{};


export class Exam extends Model<ExamAttributes,ExamCreationAttributes> implements ExamAttributes{
    public id!:number;
    public active!:boolean;
    public duration!: number;
    public deadline!:Date;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Exam.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    deadline:DataTypes.DATEONLY,
    active:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    duration:DataTypes.INTEGER,
},{
    sequelize,freezeTableName:true,timestamps:true
});

// @ts-ignore
Exam.associate = (models)=>{
    Exam.hasMany(models.StudentExam);
    Exam.belongsTo(models.Examiner);
    Exam.belongsTo(models.Course);
    Exam.hasMany(models.Question);
    Exam.hasMany(models.RegisteredExamStudent);
}