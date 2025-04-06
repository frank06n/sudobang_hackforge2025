import mongoose from 'mongoose';

const ambulanceSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
  },
  isAvailable: { type: Boolean, default: true },
  socketId: String,
});
ambulanceSchema.index({ location: '2dsphere' });

export default mongoose.model('Ambulance', ambulanceSchema);