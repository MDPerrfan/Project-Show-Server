import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import connectCloudinary from './config/cloudinary.js'

import userRouter from "./routes/userRouter.js";
import projectRouter from "./routes/projectRouter.js";
const app = express();
const port = process.env.PORT || 4000;
dotenv.config();
const allowedOrigins = [
    'http://localhost:5173',
    'https://projectshelf.netlify.app',
    'https://project-shelf.vercel.app'
]
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
connectDB()
connectCloudinary()
    //API endpoints
app.get('/', (req, res) => {
    res.send("API working");
})


app.use('/api/user', userRouter)
app.use('/api/project', projectRouter)

app.listen(port, () => {
    console.log("Server started!")
})