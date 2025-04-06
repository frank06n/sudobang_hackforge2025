// emergencyRoutes.js
import express from 'express';
import EmergencyRequest from '../models/EmergencyRequest.js';
import Ambulance from '../models/Ambulance.js';
import Hospital from '../models/Hospital.js';
import User from '../models/User.js';
import { requireAuth } from '@clerk/express';
import { notifyEmergencyContacts } from '../config/twilio.js';

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

    // Notify emergency contacts via Twilio WhatsApp
    const user = await User.findById(userId);
    if (user && user.emergencyContacts.length > 0) {
      await notifyEmergencyContacts(user.emergencyContacts, `🚨 ${user.name} is in danger!
Last Known Location: ${coordinates.join(', ')}`);
    }

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

// 🚑 Ambulance accepts request
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

    // Notify emergency contacts
    const user = await User.findById(request.userId);
    const ambulance = await Ambulance.findById(ambulanceId);
    if (user && user.emergencyContacts.length > 0 && ambulance) {
      await notifyEmergencyContacts(
        user.emergencyContacts,
        `🚑 Ambulance Assigned for ${user.name}\nAmbulance ID: ${ambulance._id}\nDriver: ${ambulance.name}\nContact: ${ambulance.phoneNumber}`
      );
    }

    res.status(200).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🏥 Hospital accepts request
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

    // Notify emergency contacts
    const user = await User.findById(request.userId);
    const hospital = await Hospital.findById(hospitalId);
    if (user && user.emergencyContacts.length > 0 && hospital) {
      await notifyEmergencyContacts(
        user.emergencyContacts,
        `🏥 Hospital Assigned for ${user.name}\nHospital Name: ${hospital.name}\nContact: ${hospital.phoneNumber || 'N/A'}`
      );
    }

    res.status(200).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
