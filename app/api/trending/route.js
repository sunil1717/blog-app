import { connectToDB } from "@/lib/mongodb";
import Trending from "@/models/Trending";
import cloudinary from "@/lib/cloudinary";
import { IncomingForm } from "formidable";
import { Readable } from "stream";

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const normalize = (val) => (Array.isArray(val) ? val[0] : val);

async function toNodeRequest(req) {
  const reader = req.body?.getReader();

  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) return this.push(null);
      this.push(value);
    },
  });

  stream.headers = Object.fromEntries(req.headers);
  return stream;
}

// -------------------- GET --------------------
export async function GET() {
  try {
    await connectToDB();
    const trendingItems = await Trending.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(trendingItems), { status: 200 });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// -------------------- POST --------------------
export async function POST(req) {
  await connectToDB();
  const nodeReq = await toNodeRequest(req);

  return new Promise((resolve) => {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(nodeReq, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return resolve(new Response("Form parse error", { status: 400 }));
      }

      try {
        const title = normalize(fields.title);

        if (!title) {
          return resolve(new Response("Missing title", { status: 400 }));
        }

        // Upload image to Cloudinary
        let uploadedImage = null;
        if (files.image) {
          const file = Array.isArray(files.image) ? files.image[0] : files.image;
          const res = await cloudinary.uploader.upload(file.filepath, {
            folder: "trending_images",
          });
          uploadedImage = res.secure_url;
        }

        const newTrending = new Trending({
          title,
          image: uploadedImage,
        });

        await newTrending.save();
        return resolve(new Response(JSON.stringify(newTrending), { status: 201 }));
      } catch (error) {
        console.error("Trending save error:", error);
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
    const id = url.searchParams.get("id");

    if (!id) return new Response("ID is required", { status: 400 });

    const deletedItem = await Trending.findByIdAndDelete(id);
    if (!deletedItem) return new Response("Item not found", { status: 404 });

    return new Response(JSON.stringify({ message: "Trending item deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
