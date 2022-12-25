import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";

interface CourseAttributes{
    id:number;
    code:string;
    title:string;
    level:string;
    type:string;
    semester:number;
    unit:number;
}


export interface CourseCreationAttributes extends Optional<CourseAttributes,"id">{};


export class Course extends Model<CourseAttributes,CourseCreationAttributes> implements CourseAttributes{
    public id!:number;
    public code!:string;
    public title!: string;
    public level!:string;
    public semester!:number;
    public type!: string;
    public unit!: number;


    public readonly createAt!:Date;
    public readonly updatedAt!:Date;

}


Course.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    level:DataTypes.STRING,
    code:DataTypes.STRING,
    semester:DataTypes.INTEGER,
    title:DataTypes.STRING,
    type:DataTypes.STRING,
    unit:DataTypes.INTEGER
},{
    sequelize,timestamps:true,freezeTableName:true
})

// @ts-ignore

Course.associate = (models)=>{
    Course.belongsTo(models.Department)
    Course.hasMany(models.RegisteredCourse);
    Course.hasOne(models.Examiner);
    Course.hasOne(models.Exam);
}