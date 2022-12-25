import db from "../models";
import { hash } from "bcrypt";
const {sequelize} = db;

const ADMIN_EMAIL="admin@fpn.portal";
const ADMIN_PASSWORD="admin_password"

const DEFAULT_PROGRAMS = [
    {name:"pre-nd",duration:1},
    {name:"nd",duration:2},
    {name:"hnd",duration:2},
]

const createAdmin = async()=>{
    const hashedPassword = await hash(ADMIN_PASSWORD,10);
    await db.Admin.create({email:ADMIN_EMAIL,password:hashedPassword});
    console.log("admin created successfully")
}

const createPrograms = async ()=>{
    await db.Program.bulkCreate(DEFAULT_PROGRAMS);
    console.log("programs added successfully")
}


const connectDB = async():Promise<void>=>{
    try{
        console.log("Connecting to Database...\n");
        await sequelize.authenticate();
        console.log("Establishing connection to database...\n");
        // await sequelize.sync({force:true});
        await sequelize.sync();
        // await createAdmin();
        // await createPrograms();
        console.log("Database synchronized successfully... \n")
    }catch(e){
        console.log(e);
        throw new Error((e as Error).message)
    }

}

export default connectDB;