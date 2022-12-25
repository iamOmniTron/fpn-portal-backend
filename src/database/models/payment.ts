import {Model,DataTypes,Optional} from "sequelize";
import sequelize from "../dbconfigs/config";


interface PaymentAttributes{
    id:string;
    description?:string;
    refId?:string;
    confirmed?:boolean;
    amount?:number;
    link?:string;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes,"id">{};


export class Payment extends Model<PaymentAttributes,PaymentCreationAttributes> implements PaymentAttributes{
    public id!:string;
    public description!: string;
    public confirmed!: boolean;
    public refId!: string;
    public link!: string;
    public amount!: number;

    public createdAt!:Date;
    public updatedAt!:Date;
}

Payment.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    refId:DataTypes.STRING,
    confirmed:DataTypes.BOOLEAN,
    description:DataTypes.STRING,
    amount:DataTypes.DECIMAL,
    link:DataTypes.STRING
},{
    sequelize,freezeTableName:true,timestamps:true
});

// @ts-ignore
Payment.associate = (models)=>{
    Payment.belongsTo(models.Candidate);
}