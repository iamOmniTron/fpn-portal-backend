import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


interface OptionAttributes{
    id:number;
    text:string;
    isAnswer:boolean;
}

export interface OptionCreationAttributes extends Optional<OptionAttributes,"id">{};

export class Option extends Model<OptionAttributes,OptionCreationAttributes> implements OptionAttributes{
    public id!:number;
    public text!:string;
    public isAnswer!: boolean;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Option.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    text:DataTypes.TEXT,
    isAnswer:DataTypes.BOOLEAN
},{
    sequelize,freezeTableName:true,timestamps:true
});

// @ts-ignore
Option.associate = (models)=>{
    Option.belongsTo(models.Question);
    Option.hasMany(models.StudentResponse);
}