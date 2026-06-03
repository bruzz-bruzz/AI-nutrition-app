import express,{Request,Response} from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import {Pool} from 'pg'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import {GoogleGenAI} from '@google/genai'
dotenv.config()
const db = new Pool({
    user:process.env.USER,
    database:process.env.DATABASE,
    password:String(process.env.PASSWORD),
    host:process.env.HOST,
    port:Number(process.env.PORT)
})
const router = express.Router()
const ai = new GoogleGenAI({
    apiKey:process.env.APIKEY
})
router.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
router.use(express.json({ limit: '20mb' }))
router.use(express.urlencoded({ limit: '20mb', extended: true }))
router.use(cookieparser())
async function verify(token:string,uuid:string){
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as {uuid:string}
        return decoded.uuid == uuid
    }
    catch(err){
        return false
    }
}
router.post('/analyseImage',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(401).json("Unauthorized")
    }
    const response = await ai.models.generateContent({
        model:"gemini-3.5-flash",
        contents:[{
            inlineData:{
                mimeType:`${req.body.imagetype}`,
                data:req.body.data
            }
        },
        {
            text:`Give me the nutritional value of the food in the image in this JSON format: {
                    "calories":"? kcal",
                    "protein":"? g",
                    "carbohydrates":"? g",
                    "fats":"? g",
                    "fiber":"? g",
                    "sodium":"? mg",
                    "iron":"? mg",
                    "calcium":"? mg",
                    "vitaminD":"? mg",
                    "vitaminC":"? mg",
                    "vitaminE":"? mg"
                }`
        }
    ]
    })
    const arr = response.text?.split('\n')
    arr?.shift()
    arr?.pop()
    return res.json(JSON.parse(arr?.join('\n') as string))
})
export default router