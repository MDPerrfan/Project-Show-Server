import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRouter.js';
dotenv.config();
const app = express()
const port = 4000;
const allowedOrigins = [
    'http://localhost:5173'
]
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
connectDB()
app.get('/', (req, res) => {
    res.send("API working")
})
app.use('/api/user', userRouter)
app.listen(port, () => {
    console.log("Server Started")
})