import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import { initSocketServer } from './sockets/socketHandler.js';
// import { sendSMS } from './config/twilio.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// Pass io to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Socket Init
initSocketServer(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));