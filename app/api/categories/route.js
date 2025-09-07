import { connectToDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
     await connectToDB();
    const categories = await Blog.distinct("category");
    return new Response(JSON.stringify({ categories }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch categories" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
