import express,{Request,Response} from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import {Pool} from 'pg'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
dotenv.config()
const db = new Pool({
    user:process.env.USER,
    database:process.env.DATABASE,
    password:String(process.env.PASSWORD),
    host:process.env.HOST,
    port:Number(process.env.PORT)
})
const router = express.Router()
router.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
router.use(express.json())
router.use(cookieparser())
async function doesEmailExist(email:string){
    const res = await db.query("SELECT * from nutrientappusers where email = $1",[email])
    return res.rows.length > 0
}
async function verify(token:string,uuid:string){
    try {
        const decoded = jsonwebtoken.verify(token,process.env.JWT_SECRET as string) as {uuid:string}
        return decoded.uuid === uuid
    }
    catch(err){
        return false
    }
}
async function verifyPassword(password:string,email:string){
    const res = await db.query("SELECT * from nutrientappusers where email = $1",[email])
    if(res.rows.length === 0){
        return false
    }
    return await bcrypt.compare(password,res.rows[0].password)
}
router.post('/verify',async(req:Request,res:Response)=>{
    const result = await verify(req.cookies.token,req.body.uuid)
    if(result === false){
        return res.json(false)
    }
    const result2 = await db.query("SELECT username FROM nutrientappusers where id = $1",[req.body.uuid])
    return res.json(result2.rows[0].username)
})
router.post('/register',async(req:Request,res:Response)=>{
    const emailExists = await doesEmailExist(req.body.email)
    if(emailExists === true){
        return res.status(400).json("Email already exists")
    }
    const hash = await bcrypt.hash(req.body.password,10)
    db.query("INSERT INTO nutrientappusers (email,password,registereddate,username) VALUES($1,$2,$3,$4)",[req.body.email,hash,new Date(),req.body.username],(err)=>{
        if(err){return res.status(500).json("Error registering user")}
        return res.status(201).json("User registered successfully")
    })
})
router.post('/login',async(req:Request,res:Response)=>{
    if(await doesEmailExist(req.body.email) === false){
        return res.status(400).json("Email does not exist")
    }
    if(await verifyPassword(req.body.password,req.body.email) === false){
        return res.status(400).json("Incorrect password")
    }
    const query = await db.query("SELECT id from nutrientappusers where email = $1",[req.body.email])
    const uuid = Number(query.rows[0].id)
    const token = jsonwebtoken.sign({uuid:String(uuid)},process.env.JWT_SECRET as string,{expiresIn:'14d'})
    res.cookie("token",token,
    {
        httpOnly:true,
        secure:process.env.NODE_ENV === 'prodution' ? true : false,
        sameSite:process.env.NODE_ENV === 'prodution' ? 'none' : 'strict',
        maxAge:1000 * 60 * 60 * 24 * 14
    })
    return res.status(200).json(uuid)
})
router.post('/logout',async(req:Request,res:Response)=>{
    res.clearCookie("token")
    return res.status(200).json("User logged out successfully")
})
router.post('/changeUsername',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json("Unauthorized")
    }
    if(await verifyPassword(req.body.password,req.body.email) === false){
        return res.status(400).json("Incorrect password")
    }
    db.query("UPDATE nutrientappusers SET username = $1 WHERE id = $2",[req.body.newUsername,req.body.uuid],(err)=>{
        if(err){return res.status(500).json("Error changing username")}
        res.clearCookie("token")
        return res.status(200).json("Username changed successfully")
    })
})
router.post('/changeEmail',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json("Unauthorized")
    }
    if(await verifyPassword(req.body.password,req.body.email) === false){
        return res.status(400).json("Incorrect password")
    }
    db.query("UPDATE nutrientappusers SET email = $1 WHERE id = $2",[req.body.newEmail,req.body.uuid],(err)=>{
        if(err){return res.status(500).json("Error changing email")}
        res.clearCookie("token")
        return res.status(200).json("Email changed successfully")
    })
})
router.post('/changePassword',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json("Unauthorized")
    }
    if(await verifyPassword(req.body.password,req.body.email) === false){
        return res.status(400).json("Incorrect password")
    }
    const hash = await bcrypt.hash(req.body.newPassword,10)
    db.query("UPDATE nutrientappusers SET password = $1 WHERE id = $2",[hash,req.body.uuid],(err)=>{
        if(err){return res.status(500).json("Error changing password")}
        res.clearCookie("token")
        return res.status(200).json("Password changed successfully")
    })
})
router.post('/getData',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json("Unauthorized")
    }
    const userData = await db.query("SELECT email,username FROM nutrientappusers WHERE id = $1",[req.body.uuid])
    return res.json(userData.rows[0])
})
export default router