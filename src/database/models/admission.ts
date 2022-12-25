import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


// enum ADMISSION_STATUS{
//     PENDING="pending",
//     ACCEPTED="accepted",
//     REJECTED="rejected"
// }


interface AdmissionAttributes{
    id:string;
    details:string;
    status:string;
}


export interface AdmissionCreationAttributes extends Optional<AdmissionAttributes,"id">{};



export class Admission extends Model<AdmissionAttributes,AdmissionCreationAttributes> implements AdmissionAttributes{
    public id!:string;
    public details!:string;
    public status!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}


Admission.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    details:DataTypes.TEXT,
    status:{
        type:DataTypes.STRING,
        defaultValue:"pending"
    }
},{
    sequelize,freezeTableName:true,timestamps:true
})


// @ts-ignore

Admission.associate = (models)=>{
    Admission.belongsTo(models.Candidate);
    Admission.belongsTo(models.Program);
    Admission.belongsTo(models.Department);
    Admission.belongsTo(models.Session);
}