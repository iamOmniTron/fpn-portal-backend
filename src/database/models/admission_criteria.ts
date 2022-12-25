import { DataTypes,Model,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


interface AdmissionCriteriaAttributes{
    id:number;
    merit?:boolean;
    catchment?:boolean;
    ssceResult?:boolean;
    ndResult?:boolean;
}

export interface AdmissionCriteriaCreationAttributes extends Optional<AdmissionCriteriaAttributes,"id">{};


export class AdmissionCriteria extends Model<AdmissionCriteriaAttributes,AdmissionCriteriaCreationAttributes> implements AdmissionCriteriaAttributes{
    public id!:number;
    public merit!:boolean;
    public catchment!: boolean;
    public ssceResult!: boolean;
    public ndResult!:boolean;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

AdmissionCriteria.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    merit:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    catchment:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    ndResult:DataTypes.BOOLEAN,
    ssceResult:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    sequelize,
    timestamps:true,
    freezeTableName:true
});

// @ts-ignore
AdmissionCriteria.associate = (models)=>{
    AdmissionCriteria.hasOne(models.Program,{
        as:"criteria"
    });
}