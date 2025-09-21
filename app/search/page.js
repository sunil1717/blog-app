import SearchClient from "@/components/SearchClient";
import { connectToDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function generateMetadata({ searchParams }) {
  const query = searchParams.query || "";

  if (!query) {
    return {
      title: "Search | MyBlog",
      description: "Search blogs on MyBlog.",
    };
  }

  try {
    await connectToDB();

    const regex = new RegExp(query, "i");
    const blogs = await Blog.find({
      $or: [{ title: regex }, { category: regex }, { tags: regex }],
    }).lean();

    return {
      title: blogs.length > 0 ? `Search: ${query} | MyBlog` : `No results for ${query} | MyBlog`,
      description:
        blogs.length > 0
          ? `Read blogs matching your search query "${query}".`
          : `No blogs found for search query "${query}".`,
    };
  } catch (err) {
    return {
      title: "Search | MyBlog",
      description: "Error fetching search results.",
    };
  }
}

export default function Page({ searchParams }) {
  const query = searchParams.query || "";
  return <SearchClient queryParam={query} />;
}
