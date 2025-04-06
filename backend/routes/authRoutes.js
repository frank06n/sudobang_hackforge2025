import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Ambulance from '../models/Ambulance.js';
import Hospital from '../models/Hospital.js';
import { clerkClient, requireAuth, getAuth } from '@clerk/express';
import { sendWhatsApp } from '../config/twilio.js'; 

const router = express.Router();

const createOtpRequest = () => {
    return {
        otp: Math.floor(100000 + Math.random() * 900000).toString(), // generate a random 6digit otp,
        generated: new Date(),
    };
}
const OTP_EXPIRY_MINUTES = 5;

const register = async (Model, req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Model.create({ name, email, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const login = async (Model, req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Model.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createUser = async (req, res) => {
    // Use `getAuth()` to get the user's `userId`
    const { userId } = getAuth(req)

    console.log('userId', userId);

    // Use Clerk's JavaScript Backend SDK to get the user's User object
    const user = await clerkClient.users.getUser(userId);
    const name = user.fullName;
    const email = user.primaryEmailAddress.emailAddress;


    console.log('user', name, email);

    const { number, documents } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findById(userId);
        console.log('is user found', existingUser);
        if (existingUser) {
            return res.status(200).json({ message: 'User already exists', user: existingUser });
        }

        const user = new User({
            _id: userId,
            name,
            email,
            number,
            documents,
            numberVerified: false,
        });

        console.log('user data', user);

        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        console.log('error', err, err.message);
        if (err.code === 11000) {
            res.status(409).json({ error: 'User with this ID/email/number already exists' });
        } else {
            res.status(500).json({ error: 'Something went wrong while creating user', details: err.message });
        }
    }
};



const verifyPhone = async (req, res) => {
    const { userId } = getAuth(req);
    const { number } = req.body;

    const otpData = createOtpRequest();

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                number,
                otpRequest: otpData,
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        // Send OTP using Twilio
        await sendWhatsApp(number, `Your verification code is: ${otpData.otp}`);

        res.status(200).json({
            message: 'OTP sent successfully',
        });
    } catch (err) {
        console.error('OTP send error:', err.message);
        res.status(500).json({ error: 'Something went wrong while sending OTP/verifying phone', details: err.message });
    }
};


const checkOtp = async (req, res) => {
    // Use `getAuth()` to get the user's `userId`
    const { userId } = getAuth(req);

    const { otp } = req.body;

    try {
        // Find the user in MongoDB using Mongoose
        const user = await User.findById(userId);

        if (!user || !user.otpRequest || !user.otpRequest.otp) {
            return res.status(404).json({ error: 'OTP not found or user does not exist' });
        }

        const now = new Date();
        const generatedTime = new Date(user.otpRequest.generated);
        const minutesDiff = (now - generatedTime) / (1000 * 60);

        if (minutesDiff > OTP_EXPIRY_MINUTES) {
            return res.status(410).json({ error: 'OTP expired' });
        }

        if (user.otpRequest.otp !== otp) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        user.numberVerified = true;
        user.otpRequest = undefined;
        await user.save();

        return res.status(200).json({ message: 'Phone number verified successfully' });

    } catch (err) {
        res.status(500).json({ error: 'Something went wrong while checking otp', details: err.message });
    }

}

// Route handler
const getUserProfile = async (req, res) => {
    const { userId } = getAuth(req);

    try {
        const user = await User.findById(userId).select('-otpRequest'); // Exclude sensitive data like OTP

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong while getting user profile', details: err.message });
    }
};


router.post('/user/create', requireAuth(), createUser);
router.post('/user/verify-phone', requireAuth(), verifyPhone);
router.post('/user/verify-phone/check-otp', requireAuth(), checkOtp);
router.get('/user/profile', requireAuth(), getUserProfile);

router.post('/ambulance/register', (req, res) => register(Ambulance, req, res));
router.post('/ambulance/login', (req, res) => login(Ambulance, req, res));

router.post('/hospital/register', (req, res) => register(Hospital, req, res));
router.post('/hospital/login', (req, res) => login(Hospital, req, res));

export default router;