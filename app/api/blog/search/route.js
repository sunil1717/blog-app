import { connectToDB } from "@/lib/mongodb";

import Blog from "@/models/Blog";

export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");

        if (!query) {
            return new Response(JSON.stringify({ message: "Search query is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const regex = new RegExp(query, "i"); // case-insensitive

        const blogs = await Blog.find({
            $or: [
                { title: regex },
                { category: regex },
                { tags: regex },
            ],
        });

        return new Response(JSON.stringify(blogs), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Search error:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
