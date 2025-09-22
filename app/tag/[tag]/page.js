import TagClient from "@/components/TagClient";
import Blog from "@/models/Blog";
import { connectToDB } from "@/lib/mongodb";

export async function generateMetadata({ params }) {
  await connectToDB();
  const blogs = await Blog.find({ "tags.slug": params.tag }).lean();


  if (!blogs || blogs.length === 0) {
    return {
      title: "Tag Not Found | Blogers",
      description: "No blogs found for this tag",
    };
  }

  const tagName = params.tag.replace(/-/g, " ");
  return {
    title: `${tagName}`,
    description: `Read the latest blogs with tag ${tagName}.`,
  };
}

export default function Page({ params }) {
  return <TagClient tagSlug={params.tag} />;
}
