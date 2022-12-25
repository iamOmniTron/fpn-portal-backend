import { DataTypes,Model,Optional } from "sequelize";
import sequelize from "../dbconfigs/config"


interface DepartmentAttributes{
    id:number;
    name:string;
    totalCreditUnit:number;
}

export interface DepartmentCreationAttributes extends Optional<DepartmentAttributes,"id">{};


export class Department extends Model<DepartmentAttributes,DepartmentCreationAttributes> implements DepartmentAttributes{

    public id!: number;
    public name!:string;
    public totalCreditUnit!: number;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Department.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    totalCreditUnit:DataTypes.INTEGER,
    name:DataTypes.STRING
},{
    sequelize,freezeTableName:true,timestamps:true
})


// @ts-ignore

Department.associate = (models)=>{
    Department.hasMany(models.Admission);
    Department.belongsTo(models.School);
    Department.hasMany(models.Level);
    Department.belongsTo(models.Program);
    Department.hasMany(models.Course)
}