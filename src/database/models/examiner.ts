import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";

interface ExaminerAttributes{
    id:string;
    fullname:string;
    email:string;
    password:string;
}

export interface ExaminerCreationAttributes extends Optional<ExaminerAttributes,"id">{};


export class Examiner extends Model<ExaminerAttributes,ExaminerCreationAttributes> implements ExaminerAttributes{
    public id!:string;
    public fullname!:string;
    public email!:string;
    public password!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Examiner.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    fullname:DataTypes.STRING,
    email:DataTypes.STRING,
    password:DataTypes.STRING
},{
    sequelize,freezeTableName:true,timestamps:true
});


// @ts-ignore
Examiner.associate = (models)=>{
    Examiner.belongsTo(models.Course);
    Examiner.hasOne(models.Exam);
}