import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
  },
  availableBeds: Number,
  socketId: String,
});
hospitalSchema.index({ location: '2dsphere' });

export default mongoose.model('Hospital', hospitalSchema);