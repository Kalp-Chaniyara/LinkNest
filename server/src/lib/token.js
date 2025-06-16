import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const generateAccesstoken = (userId,authMethod='local')=>{
     return jwt.sign({userId,authMethod},process.env.SESSION_SECRET,{expiresIn:"7d"});
}

export default generateAccesstoken