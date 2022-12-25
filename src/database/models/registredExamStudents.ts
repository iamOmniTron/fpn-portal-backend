import { DataTypes,Model,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


interface RegisteredExamStudentAttributes{
    id:number;
}

interface RegisteredExamStudentCreationAttributes extends Optional<RegisteredExamStudentAttributes,"id">{};

export class RegisteredExamStudent extends Model<RegisteredExamStudentAttributes,RegisteredExamStudentCreationAttributes> implements RegisteredExamStudentAttributes{
    public id!:number;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

RegisteredExamStudent.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    }
},{
    sequelize,freezeTableName:true,timestamps:true
});


// @ts-ignore
RegisteredExamStudent.associate = (models)=>{
    RegisteredExamStudent.belongsTo(models.Exam);
    RegisteredExamStudent.belongsTo(models.Candidate);
}