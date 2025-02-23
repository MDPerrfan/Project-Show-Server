import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verifyOtp: {
        type: String,
        default: ''
    },
    verifyOtpExpired: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpired: {
        type: Number,
        default: 0
    },
    image: { type: String, default: "data:image/webp;base64,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" },
    address: { type: Object, default: { line1: '', line2: '' } },
    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },
    phone: { type: String, default: "+8801......" }

});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;