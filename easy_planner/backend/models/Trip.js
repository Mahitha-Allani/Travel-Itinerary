import mongoose from 'mongoose'

const tripSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source:      { type: String, required: true },
    destination: { type: String, required: true },
    days:        { type: Number, required: true, min: 1 },
    startDate:   { type: Date },
    endDate:     { type: Date },
    tripType:    { type: String, enum: ['Solo', 'Friends', 'Family', 'Professional'], default: 'Solo' },
    cost: {
      flight: mongoose.Schema.Types.Mixed,
      train:  mongoose.Schema.Types.Mixed,
      bus:    mongoose.Schema.Types.Mixed,
    },
    places:     [String],
    activities: [String],
  },
  { timestamps: true }
)

const Trip = mongoose.model('Trip', tripSchema)
export default Trip
