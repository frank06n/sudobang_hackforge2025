import express from 'express';
import EmergencyRequest from '../models/EmergencyRequest.js';
import Ambulance from '../models/Ambulance.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// User creates emergency request
router.post('/request', requireAuth({ signInUrl: '/sign-in' }), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { coordinates } = req.body;
    const newRequest = await EmergencyRequest.create({
      userId,
      location: { type: 'Point', coordinates },
      status: 'pending',
      updates: [],
    });

    // Notify nearby ambulances
    const nearbyAmbulances = await Ambulance.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: 5000,
        },
      },
      isAvailable: true,
      socketId: { $ne: null },
    });

    nearbyAmbulances.forEach((ambulance) => {
      req.io.to(ambulance.socketId).emit('new-emergency', newRequest);
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// 🚑 Ambulance accepts request - Use PATCH instead of POST
router.patch('/accept/ambulance/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { ambulanceId } = req.body;

    const request = await EmergencyRequest.findByIdAndUpdate(
      requestId,
      {
        ambulanceId,
        status: 'ambulance_accepted',
        $push: {
          updates: {
            type: 'ambulance_accepted',
            data: { ambulanceId },
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!request) return res.status(404).json({ error: 'Emergency request not found' });

    res.status(200).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🏥 Hospital accepts request - Use PATCH instead of POST
router.patch('/accept/hospital/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { hospitalId } = req.body;

    const request = await EmergencyRequest.findByIdAndUpdate(
      requestId,
      {
        hospitalId,
        status: 'hospital_accepted',
        $push: {
          updates: {
            type: 'hospital_accepted',
            data: { hospitalId },
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!request) return res.status(404).json({ error: 'Emergency request not found' });

    res.status(200).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;