import CategoryClient from "@/components/CategoryClient";
import Blog from "@/models/Blog";
import { connectToDB } from "@/lib/mongodb";

export async function generateMetadata({ params }) {
  await connectToDB();
  const blogs = await Blog.find({ category: params.category.replace(/-/g, " ") }).lean();

  if (!blogs || blogs.length === 0) {
    return {
      title: "Category Not Found | Blogers",
      description: "No blogs found for this category",
    };
  }

  const categoryName = params.category.replace(/-/g, " ");
  return {
    title: `${categoryName}`,
    description: `Read the latest blogs in ${categoryName} category.`,
  };
}

export default function Page({ params }) {
  return <CategoryClient categorySlug={params.category} />;
}
