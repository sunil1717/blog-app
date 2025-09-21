import Blog from "@/models/Blog";
import { connectToDB } from "@/lib/mongodb";


export async function GET() {
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

  // Connect to DB
 await connectToDB();

  // Fetch all blogs
  const blogs = await Blog.find({}, "slug category tags publishedDate").lean();

  // Static pages
  const staticUrls = [`${baseUrl}/`];

  // Blog URLs
  const blogUrls = blogs.map(
    (b) => `<url>
      <loc>${baseUrl}/${b.slug}</loc>
      <lastmod>${b.publishedDate.toISOString()}</lastmod>
    </url>`
  );

  // Unique categories
  const categories = [...new Set(blogs.map((b) => b.category))];
  const categoryUrls = categories.map(
    (c) => `<url>
      <loc>${baseUrl}/category/${c.trim().replace(/\s+/g, "-")}</loc>
    </url>`
  );

  // Unique tags
  const tags = [...new Set(blogs.flatMap((b) => b.tags || []))];
  const tagUrls = tags.map(
    (t) => `<url>
      <loc>${baseUrl}/tag/${t.trim().replace(/\s+/g, "-")}</loc>
    </url>`
  );

  // Combine all URLs
  const allUrls = [
    ...staticUrls.map((url) => `<url><loc>${url}</loc></url>`),
    ...blogUrls,
    ...categoryUrls,
    ...tagUrls,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls.join("\n")}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
