import mongoose from "mongoose";
import slugify from "slugify";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    metaTitle: { type: String, default: "" },
    content: { type: String, required: true },
    metaContent: { type: String, default: "" },
    tags: { type: [String], default: [] },
    publishedDate: { type: Date, default: Date.now },
    slug: { type: String, required: true, unique: true },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 3"], // max 3 images
      default: [],
    },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

// Validate images array length
function arrayLimit(val) {
  return val.length <= 3;
}

// Pre-save hook to auto-generate slug from title
BlogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
