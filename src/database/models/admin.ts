import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";

interface AdminAttributes{
    id:number;
    email:string;
    password:string;
}

export interface AdminCreationAttributes extends Optional<AdminAttributes,"id">{};


export class Admin extends Model<AdminAttributes,AdminCreationAttributes> implements AdminAttributes{
    public id!:number;
    public email!:string;
    public password!: string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Admin.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:DataTypes.STRING,
    password:DataTypes.STRING
},{
    sequelize,timestamps:true,freezeTableName:true
});


