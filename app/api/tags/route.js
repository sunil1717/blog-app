import { connectToDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectToDB();
    const tags = await Blog.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags.slug", name: { $first: "$tags.name" } } }
    ]);
    return new Response(JSON.stringify({ tags }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch tags" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
