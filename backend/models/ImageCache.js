import mongoose from 'mongoose'

const ImageCacheSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('ImageCache', ImageCacheSchema)
