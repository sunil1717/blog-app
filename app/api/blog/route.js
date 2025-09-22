import { connectToDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import cloudinary from "@/lib/cloudinary";
import { IncomingForm } from "formidable";
import { Readable } from "stream";

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const normalize = (val) => Array.isArray(val) ? val[0] : val;

// ✅ Convert Next.js Request → Node-like request with body + headers
async function toNodeRequest(req) {
  const reader = req.body?.getReader();

  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) return this.push(null);
      this.push(value);
    },
  });

  // attach headers for formidable
  stream.headers = Object.fromEntries(req.headers);

  return stream;
}

// -------------------- GET --------------------
export async function GET(request) {
  try {
    await connectToDB();

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const category = url.searchParams.get("category");
    const tag = url.searchParams.get("tag");
    const recent = url.searchParams.get("recent");
    const exclude = url.searchParams.get("exclude");

    // 1. Fetch by slug
    if (slug) {
      const blog = await Blog.findOne({ slug });
      if (!blog) return new Response("Blog not found", { status: 404 });
      return new Response(JSON.stringify(blog), { status: 200 });
    }
    // 3. Filter by recent blogs 
    if (recent === "true") {
      const query = {};
      if (exclude) query.slug = { $ne: exclude }; // exclude current blog

      const recentBlogs = await Blog.find(query).sort({ createdAt: -1 }).limit(5);
      return new Response(JSON.stringify(recentBlogs), { status: 200 });
    }

    // 3. Filter by category or tag
    const query = {};
    if (category) query["category.slug"] = category;
    if (tag) query["tags.slug"] = tag;

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return new Response(JSON.stringify(blogs), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}


// -------------------- POST --------------------
export async function POST(req) {
  await connectToDB();
  const nodeReq = await toNodeRequest(req);

  return new Promise((resolve) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });

    form.parse(nodeReq, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return resolve(new Response("Form parse error", { status: 400 }));
      }

      try {
        const title = normalize(fields.title);
        const metaTitle = normalize(fields.metaTitle);
        const content = normalize(fields.content);
        const metaContent = normalize(fields.metaContent);
        const tags = normalize(fields.tags);
        const category = normalize(fields.category);

        if (!title || !content) {
          return resolve(new Response("Missing required fields", { status: 400 }));
        }

        // Convert tags string to array of objects { name }
        const tagsArray = tags
          ? tags.split(",").map((t) => ({ name: t.trim() }))
          : [];


        // Upload images to Cloudinary (max 3)
        const uploadedImages = [];
        if (files.images) {
          const fileArray = Array.isArray(files.images) ? files.images : [files.images];
          for (let file of fileArray.slice(0, 3)) {
            const res = await cloudinary.uploader.upload(file.filepath, {
              folder: "blog_images",
            });
            uploadedImages.push(res.secure_url);
          }
        }


        const categoryObj = category
          ? { name: category.trim() }
          : { name: "General" };

        const newBlog = new Blog({
          title,
          metaTitle,
          content,
          metaContent,
          tags: tagsArray,
          category: categoryObj,
          images: uploadedImages,
        });

        await newBlog.save();
        return resolve(new Response(JSON.stringify(newBlog), { status: 201 }));
      } catch (error) {
        console.error("Blog save error:", error);
        return resolve(new Response(error.message, { status: 500 }));
      }
    });
  });
}



// -------------------- DELETE --------------------
export async function DELETE(request) {
  try {
    await connectToDB();

    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // get the MongoDB _id

    if (!id) return new Response("ID is required", { status: 400 });

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) return new Response("Blog not found", { status: 404 });

    return new Response(JSON.stringify({ message: "Blog deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
