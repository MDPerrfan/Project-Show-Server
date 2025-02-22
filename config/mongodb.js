import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGODB_URL}/projectshow`)
    } catch {
        console.error("DB connection error:", error.message);
    }
}
export default connectDB;