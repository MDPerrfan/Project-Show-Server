import validator from "validator"
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import transporter from "../nodemailer/nodemailer.js";
import { v2 as cloudinary } from 'cloudinary';
//api to register user
export const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if all details are provided
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // 2. Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        // 3. Validate password length
        if (!validator.isLength(password, { min: 8 })) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        // 4. Validate name length
        if (!validator.isLength(name, { min: 3 })) {
            return res.status(400).json({ message: 'Name must be at least 3 characters long.' });
        }

        // 5. Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // 6. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7. Save the new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        // 8. Generate a token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to the Project and Thesis Management Platform!',
            text: `Dear ${name},\n\nWelcome to our Project and Thesis Management Platform! Your account has been successfully created with the email address ${email}. You can now add and manage details of the projects and theses you supervise.\n\nWe look forward to your contributions!\n\nBest regards,\nMohammed Parves\nCSE-27-D-A`
        }
        await transporter.sendMail(mailOptions);

        // 9. Send success response
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
};

//api for user login

const loginUser = async(req, res) => {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email })
            if (!user) {
                res.status(401).json({ success: false, message: "User does not exist!" });
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                // Create a token with email as the payload
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                res.json({
                    success: true,
                    token
                });
            } else {
                res.status(401).json({ success: false, message: "INVALID CREDENTIALS!" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred during user login.' });
        }
    }
    //api to get user profile data
const getProfile = async(req, res) => {
        try {
            const { userId } = req.body
            const userData = await userModel.findById(userId).select('-password')
            res.json({ success: true, userData })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
    //api to update user profile
const updateProfile = async(req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file
        if (!name || !gender || !phone || !address || !dob) {
            return res.json({ success: false, message: "Data missing!" });
        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if (imageFile) {
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageUrl })
        }
        res.json({ success: true, message: "Profile Updated!" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}