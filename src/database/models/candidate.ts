import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";

interface CandidateAttributes{
    id:string;
    email?:string;
    phone?:string;
    dob?:Date;
    firstname?:string;
    stateOfOrigin?:string;
    address?:string;
    contactAddress?:string;
    localGovernmentArea?:string;
    lastname?:string;
    middlename?:string;
    gender?:string;
    matricNumber?:string;
    nextOfKinFirstname?:string;
    nextOfKinLastname?:string;
    nextOfKinMiddlename?:string;
    nextOfKinPhone?:string;
    paid?:boolean;
    isVerified?:boolean;
    emailToken?:string;
    password?:string;
}

export interface CandidateCreationAttributes extends Optional<CandidateAttributes,"id">{};


export class Candidate extends Model<CandidateAttributes,CandidateCreationAttributes> implements CandidateAttributes{

    public id!:string;
    public email!:string;
    public phone!: string;
    public firstname!: string;
    public lastname!: string;
    public gender!: string;
    public address!:string;
    public localGovernmentArea!: string;
    public contactAddress!:string;
    public matricNumber!: string;
    public stateOfOrigin!:string;
    public dob!: Date;
    public nextOfKinFirstname!: string;
    public nextOfKinLastname!: string;
    public nextOfKinMiddlename!: string;
    public nextOfKinPhone!: string;
    public paid!: boolean;
    public middlename!:string;
    public isVerified!: boolean;
    public emailToken!: string;
    public password!: string;

    public createdAt!:Date;
    public updatedAt!:Date;

}

Candidate.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    email:{
        type:DataTypes.STRING,
        unique:true
    },
    dob:DataTypes.DATE,
    gender:DataTypes.STRING,
    address:DataTypes.STRING,
    contactAddress:DataTypes.STRING,
    localGovernmentArea:DataTypes.STRING,
    matricNumber:DataTypes.STRING,
    stateOfOrigin:DataTypes.STRING,
    nextOfKinFirstname:DataTypes.STRING,
    nextOfKinMiddlename:DataTypes.STRING,
    nextOfKinLastname:DataTypes.STRING,
    nextOfKinPhone:DataTypes.STRING,
    paid:DataTypes.BOOLEAN,
    password:DataTypes.STRING,
    firstname:DataTypes.STRING,
    lastname:DataTypes.STRING,
    middlename:DataTypes.STRING,
    isVerified:DataTypes.BOOLEAN,
    emailToken:DataTypes.STRING,
    phone:DataTypes.STRING
},{
    sequelize,freezeTableName:true,timestamps:true
});

// @ts-ignore
Candidate.associate = (models)=>{
    Candidate.hasOne(models.Admission);
    Candidate.hasMany(models.Payment);
    Candidate.hasMany(models.RegisteredCourse);
    Candidate.hasMany(models.StudentResponse);
    Candidate.hasMany(models.StudentExam);
    Candidate.hasMany(models.RegisteredExamStudent);
}
