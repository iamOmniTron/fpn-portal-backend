import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


interface QuestionAttributes{
    id:number;
    text:string;
}

export interface QuestionCreationAttributes extends Model<QuestionAttributes,"id">{};


export class Question extends Model<QuestionAttributes,QuestionCreationAttributes> implements QuestionAttributes{
    public id!:number;
    public text!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Question.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    text:DataTypes.TEXT
},{sequelize,freezeTableName:true,timestamps:true});

// @ts-ignore
Question.associate = (models)=>{
    Question.hasMany(models.Option);
    Question.hasMany(models.StudentResponse);
    Question.belongsTo(models.Exam);
}