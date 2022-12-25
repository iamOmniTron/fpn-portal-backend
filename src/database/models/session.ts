import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


interface SessionAttributes{
    id:number;
    startYear:number;
    endYear:number;
    active:boolean;
}

export interface SessionCreationAttributes extends Optional<SessionAttributes,"id">{};


export class Session extends Model<SessionAttributes,SessionCreationAttributes> implements SessionAttributes{
    public id!:number;
    public startYear!:number;
    public endYear!: number;
    public active!:boolean;


    public createdAt!:Date;
    public updatedAt!:Date;
}


Session.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    active:DataTypes.BOOLEAN,
    startYear:DataTypes.INTEGER,
    endYear:DataTypes.INTEGER
},{
    sequelize,freezeTableName:true,timestamps:true
})

// @ts-ignore

Session.associate = (models)=>{
    Session.hasMany(models.Admission);
}