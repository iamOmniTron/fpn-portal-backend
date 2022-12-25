import "dotenv/config";
import {createServer} from "http";
import app from "./app";

const PORT = process.env.SERVER_PORT;

createServer(app).listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
});