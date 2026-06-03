import express,{Request,Response} from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import {Pool} from 'pg'
import dotenv from 'dotenv'
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
router.use(express.json({ limit: '20mb' }))
router.use(express.urlencoded({ limit: '20mb', extended: true }))
router.use(cookieparser())
async function verify(token:string,uuid:string){
    try {
        const decoded = jsonwebtoken.verify(token,process.env.JWT_SECRET as string) as {uuid:string}
        return decoded.uuid == uuid
    }
    catch(err){
        return false
    }
}
router.post('/addLog',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(401).json("Unauthorized")
    }
    db.query("insert into nutrientapplogs(userid,nutrientdata,logdate,title,imagetype,imagedata) Values($1,$2,$3,$4,$5,$6)",[req.body.uuid,req.body.data,new Date(),req.body.title,req.body.imagetype,req.body.imagedata],(err)=>{
        if(err){
            return res.status(500).json("Error adding log")
        }
        return res.status(200).json("Log added successfully")
    })
})
router.post('/deleteLogs',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(401).json("Unauthorized")
    }
    db.query("delete from nutrientapplogs where logid = $1",[req.body.logid],(err)=>{
        if(err){
            return res.status(500).json("Error deleting log")
        } else{
            return res.status(200).json("Log deleted successfully.")
        }
    })
})
router.post('/getLogs',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(401).json("Unauthorized")
    }
    const results = await db.query("SELECT * from nutrientapplogs where userid = $1 order by logdate ASC",[req.body.uuid])
    return res.json(results.rows)
})
export default router