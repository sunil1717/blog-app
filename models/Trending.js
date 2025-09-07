import mongoose from "mongoose";

const TrendingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Trending ||
  mongoose.model("Trending", TrendingSchema);
