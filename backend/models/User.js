import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        type: String, // Using clerk_id as string _id
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    number: {
        type: String,
    },
    numberVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    otpRequest: {
        otp: {
            type: String,
        },
        generated: {
            type: Date,
        },
    },
}, { versionKey: false });

export default mongoose.model('User', userSchema);