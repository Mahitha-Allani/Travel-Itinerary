import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    userName:   { type: String, required: true },
    userInitial:{ type: String },
    rating:     { type: Number, required: true, min: 1, max: 5 },
    text:       { type: String, required: true },
    tripType:   { type: String, default: 'Traveller' },
  },
  { timestamps: true }
)

const Review = mongoose.model('Review', reviewSchema)
export default Review
