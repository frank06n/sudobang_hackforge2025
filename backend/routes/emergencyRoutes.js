import express from 'express';
import EmergencyRequest from '../models/EmergencyRequest.js';
import Ambulance from '../models/Ambulance.js';
import { requireAuth } from '@clerk/express';

const MAX_DISTANCE_METERS = 5000;

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

        console.log('new request', newRequest);
        try {
            // Notify nearby ambulances
            const nearbyAmbulances = await Ambulance.find({
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates },
                        $maxDistance: MAX_DISTANCE_METERS,
                    },
                },
                isAvailable: true,
                socketId: { $ne: null },
            });
            console.log('nearby ambulances', nearbyAmbulances);
    
            nearbyAmbulances.forEach((ambulance) => {
                req.io.to(ambulance.socketId).emit('new-emergency', newRequest);
            });
        }
        catch (err) {
            console.error('Error notifying ambulances:', err);
        }

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

// Assume you have imported Express, the EmergencyRequest model, and the Ambulance model
router.post('/check-assigned-ambulance', requireAuth({ signInUrl: '/sign-in' }), async (req, res) => {
    try {
        const { emergencyRequestId } = req.body;
        if (!emergencyRequestId) {
            return res.status(400).json({ message: 'Emergency request ID is required' });
        }

        // Find the emergency request by its ID
        const emergencyRequest = await EmergencyRequest.findById(emergencyRequestId);
        if (!emergencyRequest) {
            return res.status(404).json({ message: 'Emergency request not found' });
        }

        // Check if an ambulance has been assigned
        if (!emergencyRequest.ambulanceId) {
            return res.status(200).json({ assigned: false });
        }

        // Find the assigned ambulance to get its socketId
        const ambulance = await Ambulance.findById(emergencyRequest.ambulanceId);
        if (!ambulance) {
            return res.status(404).json({ message: 'Ambulance not found' });
        }

        // Return the socketId so the client can subscribe to its live updates
        return res.status(200).json({ assigned: true, socketId: ambulance.socketId });
    } catch (err) {
        console.error("Error checking assigned ambulance:", err.message);
        res.status(500).json({ message: err.message });
    }
});


export default router;