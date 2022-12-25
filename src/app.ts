import express, {Application, NextFunction, Request,Response} from "express";
import connectDB from "./database/dbconfigs/connection";
import router from "./routers";
import cors from "cors";
import { ZodError } from "zod";

const app:Application = express();

// database initialization
(async()=>await connectDB())();


// cross-origin resource
app.use(cors({
    origin:"*"
}));

// To parse json request body
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// ROUTER
app.use("/",router);

app.use("/",(err:any,req:Request,res:Response,next:NextFunction)=>{
    console.log(err);
   
    if(err instanceof ZodError){
        let messages:Array<string> = [];
        for(let e of err.issues){
            messages.push(e.message);
        }
        return res.json({
            success:false,
            message:messages
        })
    }
    if(err instanceof Error){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
    return res.status(500).json({
        success:false,
        message:"Internal server error"
    })
})


export default app;