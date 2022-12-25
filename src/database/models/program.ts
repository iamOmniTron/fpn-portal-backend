import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


// duration is the number of years it takes to  run the program, ND and HND are both 2 years while pre-nd is 1 year

interface ProgramAttributes{
    id:number;
    name:string;
    duration:number;
}

export interface ProgramCreationAttributes extends Optional<ProgramAttributes,"id">{};

export class Program extends Model<ProgramAttributes,ProgramCreationAttributes> implements ProgramAttributes{

    public id!: number;
    public name!: string;
    public duration!: number;

    public createdAt!:Date;
    public updatedAt!:Date;
}

Program.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:DataTypes.STRING,
    duration:DataTypes.INTEGER
},{
    sequelize,freezeTableName:true,timestamps:true
});


// @ts-ignore
Program.associate = (models)=>{
    Program.belongsTo(models.AdmissionCriteria);
    Program.hasMany(models.Department);
    Program.hasMany(models.Admission);
    Program.hasMany(models.School);
}