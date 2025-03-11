import express from 'express';
import { getProfile, isAuthenticated, loginUser, logout, registerUser, resetPassword, sendResetOtp, sendVerifyOtp, updateProfile, verifyEmail } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logout);
userRouter.post('/reset-otp', sendResetOtp);
userRouter.post('/verify-otp', userAuth, sendVerifyOtp);
userRouter.post('/verify-email', userAuth, verifyEmail);
userRouter.post('/update-profile', upload.single('image'), updateProfile);
userRouter.post('/reset-pass', resetPassword);
userRouter.get('/is-auth', userAuth, isAuthenticated);
userRouter.get('/data', userAuth, getProfile);

export default userRouter;