import "dotenv/config";
import {Sequelize,Dialect} from "sequelize";

const DB_USER = process.env.DB_USER as string;
const DB_NAME = process.env.DB_NAME as string;
const DB_PASS = process.env.DB_PASS as string;
const DIALECT = process.env.DB_DIALECT as Dialect;


const sequelize = new Sequelize(DB_NAME,DB_USER,DB_PASS,{
    host:process.env.NODE_ENV === "development" ?"localhost":process.env.DB_HOST,
    dialect:DIALECT,
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
})


export default sequelize;