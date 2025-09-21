import BlogClient from "@/components/BlogClient";
import Blog from "@/models/Blog";
import { connectToDB } from "@/lib/mongodb";

export async function generateMetadata({ params }) {
  await connectToDB();
  const blog = await Blog.findOne({ slug: params.slug }).lean();

  if (!blog) {
    return {
      title: "Blog Not Found | Blogers",
      description: "The requested blog does not exist.",
    };
  }

  return {
    title: `${blog.title}`,
    description: blog.excerpt || blog.content.slice(0, 150),
  };
}

export default function Page({ params }) {
  return <BlogClient slug={params.slug} />;
}
