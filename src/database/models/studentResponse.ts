import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";

interface StudentResponseAttributes{
    id:number;
}


export interface StudentResponseCreationAttributes extends Optional<StudentResponseAttributes,"id">{};


export class StudentResponse extends Model<StudentResponseAttributes,StudentResponseCreationAttributes> implements StudentResponseAttributes{
    public id!:number;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

StudentResponse.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    }
},{
    sequelize,freezeTableName:true,timestamps:true
});

// @ts-ignore
StudentResponse.associate = (models)=>{
    StudentResponse.belongsTo(models.Candidate);
    StudentResponse.belongsTo(models.StudentExam);
    StudentResponse.belongsTo(models.Question);
    StudentResponse.belongsTo(models.Option);
}