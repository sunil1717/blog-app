import mongoose from "mongoose";
import slugify from "slugify";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    metaTitle: { type: String, default: "" },
    content: { type: String, required: true },
    metaContent: { type: String, default: "" },

    // Tags with name + slug
    tags: [
      {
        name: { type: String, required: true },
        slug: { type: String, required: true },
      },
    ],

    publishedDate: { type: Date, default: Date.now },

    // Unique slug for blog post (from title)
    slug: { type: String, required: true, unique: true },

    // Images
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 3"], // max 3 images
      default: [],
    },

    // Category with name + slug
    category: {
      name: { type: String, default: "General" },
      slug: { type: String, default: "general" },
    },
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
  if (this.category?.name) {
    this.category.slug = slugify(this.category.name, { lower: true, strict: true });
  }
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map((t) => ({
      name: t.name,
      slug: slugify(t.name, { lower: true, strict: true }),
    }));
  }
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
