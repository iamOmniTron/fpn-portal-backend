import { DataTypes,Model,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


interface SchoolAttributes{
    id:number;
    name:string;
}

export interface SchoolCreationAttributes extends Optional<SchoolAttributes,"id">{};


export class School extends Model<SchoolAttributes,SchoolCreationAttributes> implements SchoolAttributes{
    public id!: number;
    public name!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}


School.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:DataTypes.STRING
},{
    sequelize,freezeTableName:true,timestamps:true
});


// @ts-ignore
School.associate = (models)=>{
    School.hasMany(models.Department);
    School.belongsTo(models.Program);
}

