import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../dbconfigs/config";


interface RegisteredCourseAttributes{
    id:number;
}

export interface RegisteredCourseCreationAttributes extends Optional<RegisteredCourseAttributes,"id">{};


export class RegisteredCourse extends Model<RegisteredCourseAttributes,RegisteredCourseCreationAttributes> implements RegisteredCourseAttributes{
    public id!:number;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}


RegisteredCourse.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    }
},{
    sequelize,freezeTableName:true,timestamps:true
});

// @ts-ignore
RegisteredCourse.associate = (models)=>{
    RegisteredCourse.belongsTo(models.Candidate);
    RegisteredCourse.belongsTo(models.Course);
}   