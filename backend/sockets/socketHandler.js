import Ambulance from '../models/Ambulance.js';
import Hospital from '../models/Hospital.js';
import Emergency from '../models/EmergencyRequest.js';

export const initSocketServer = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Store socketId for ambulances/hospitals
    socket.on('register', async ({ id, role }) => {
      try {
        if (role === 'ambulance') {
          await Ambulance.findByIdAndUpdate(id, { socketId: socket.id });
        } else if (role === 'hospital') {
          await Hospital.findByIdAndUpdate(id, { socketId: socket.id });
        }
      } catch (err) {
        console.error('Socket register error:', err.message);
      }
    });

    // Live location update from ambulance
    socket.on('location-update', async ({ requestId, coordinates }) => {
      io.emit(`ambulance-location-${requestId}`, coordinates);

      // Update emergency location in DB
      try {
        await Emergency.findByIdAndUpdate(requestId, {
          $push: {
            updates: {
              status: 'location-update',
              data: { coordinates },
              timestamp: new Date(),
            },
          },
        });
      } catch (err) {
        console.error('Failed to update location in DB:', err.message);
      }
    });

    // Pickup and arrival events
    socket.on('status-update', async ({ requestId, status, data }) => {
      io.emit(`status-update-${requestId}`, { status, data });

      // Update emergency status in DB
      try {
        await Emergency.findByIdAndUpdate(requestId, {
          $set: { status },
          $push: {
            updates: {
              status,
              data,
              timestamp: new Date(),
            },
          },
        });
      } catch (err) {
        console.error('Failed to update status in DB:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};