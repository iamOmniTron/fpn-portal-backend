import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";

interface StudentExamAttributes{
    id:number;
    submitted:boolean;
    ended:boolean;
    taken:boolean;
}

export interface StudentExamCreationAttributes extends Optional<StudentExamAttributes,"id">{};


export class StudentExam extends Model<StudentExamAttributes,StudentExamCreationAttributes> implements StudentExamAttributes{
    public id!:number;
    public submitted!: boolean;
    public ended!:boolean;
    public taken!:boolean;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}


StudentExam.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    submitted:DataTypes.BOOLEAN,
    ended:DataTypes.BOOLEAN,
    taken:DataTypes.BOOLEAN
},{
    sequelize,freezeTableName:true,timestamps:true
});


// @ts-ignore
StudentExam.associate = (models)=>{
    StudentExam.belongsTo(models.Candidate);
    StudentExam.belongsTo(models.Exam);
    StudentExam.hasMany(models.StudentResponse);
}