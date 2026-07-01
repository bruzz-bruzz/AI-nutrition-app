import express from 'express'
import helmet from 'helmet'
import userRoutes from './routes/Users'
import dataRoutes from './routes/Data'
import aiRoutes from './routes/AiModel'
import rateLimit from 'express-rate-limit'
const limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:100,
    message:"Too many requests from this IP, please try again after 15 minutes",
    statusCode:429
})
const app = express()
app.use(limiter)
app.use(helmet())
app.use('/users', userRoutes)
app.use('/data',dataRoutes)
app.use('/ai',aiRoutes)
app.listen(8080)