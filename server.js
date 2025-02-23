import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
const app = express();
const port = process.env.PORT || 4000;
dotenv.config();
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
    //API endpoints
app.get('/', (req, res) => {
    res.send("API working");
})


app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log("Server started!")
})