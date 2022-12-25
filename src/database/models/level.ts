import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../dbconfigs/config";


interface LevelAttributes{
    id:number;
    maxCreditUnit:number
}


export interface LevelCreationAttributes extends Optional<LevelAttributes,"id">{};


export class Level extends Model<LevelAttributes,LevelCreationAttributes> implements LevelAttributes{
    public id!: number;
    public maxCreditUnit!: number;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Level.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    maxCreditUnit:DataTypes.INTEGER,
},
{
    sequelize,timestamps:true,freezeTableName:true
})

// @ts-ignore
Level.associate = (models)=>{
    Level.belongsTo(models.Department);
}