import express from 'express';
import { getProfile, isAuthenticated, loginUser, logout, registerUser, resetPassword, sendResetOtp, sendVerfiyOtp, verifyEmail } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';
const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logout);
userRouter.post('/reset-otp', sendResetOtp)
userRouter.post('/verify-otp', userAuth, sendVerfiyOtp)
userRouter.post('/verify-email', userAuth, verifyEmail)
userRouter.post('/reset-pass', resetPassword)
userRouter.get('/is-auth', userAuth, isAuthenticated)
userRouter.get('/data', userAuth, getProfile);



export default userRouter