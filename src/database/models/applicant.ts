import {Optional,Model,DataTypes} from "sequelize";
import sequelize from "../dbconfigs/config";

interface ApplicantAttributes{
    id:string;
    registrationNumber:string;
    UTMEScore:number;
}

export interface ApplicantCreationAttributes extends Optional<ApplicantAttributes,"id">{};


export class Applicant extends Model<ApplicantAttributes,ApplicantCreationAttributes> implements ApplicantAttributes{

    public id!:string;
    public registrationNumber!: string;
    public UTMEScore!: number;

    public readonly createAt!:Date;
    public readonly updatedAt!:Date;
}


Applicant.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    registrationNumber:DataTypes.STRING,
    UTMEScore:DataTypes.INTEGER
},{
    sequelize,freezeTableName:true,timestamps:true
});

// @ts-ignore
// Applicant.associate = (models)=>{

// }