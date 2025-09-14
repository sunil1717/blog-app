"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import Navbar from "@/components/Navbar";
import PopularSection from "@/components/PopularSection";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";








export default function SingleBlogPage() {
  const router = useRouter();

  const { slug } = useParams(); //  get slug in App Router



  const { singleblog, fetchSingleBlogs, loading, error, recentBlogs, relatedBlogs, fetchRecentBlogs, fetchRelatedBlogs } = useBlogStore();



  const slugify = (str) =>
    str?.trim().replace(/\s+/g, "-");


  useEffect(() => {
    if (!slug) return;

    fetchSingleBlogs(slug.toLowerCase());
    fetchRecentBlogs(slug.toLowerCase());
  }, [slug, fetchRecentBlogs]);


  // Fetch related blogs once singleblog is updated
  useEffect(() => {
    if (singleblog?._id) {
      fetchRelatedBlogs(singleblog);
    }
  }, [singleblog, fetchRelatedBlogs]);


  if (!singleblog || loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin border-opacity-70"></div>
    </div>
  );

  return (
    <>


      <Navbar />
      <section className="bg-[#f8f9fb] py-12">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT SIDE: Blog Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500">
              <Link href="/">Home</Link> &bull;{" "}
              <Link href={`/category/${slugify(singleblog.category)}`}>{singleblog.category}</Link>{" "}
              &bull; <span>{singleblog.title}</span>
            </div>

            {/* Blog Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {singleblog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div>{singleblog.author || "Admin"}</div>
              <div>• {new Date(singleblog.publishedDate).toLocaleDateString()}</div>
              <div>
                • {Math.ceil(singleblog.content?.split(" ").length / 200)} min read
              </div>
            </div>

            {/* Interleaved Images & Content */}
            <div className="space-y-8">
              {singleblog.images?.slice(0, 3).map((img, idx) => {
                const paragraphs = singleblog.content.split("</p>");
                const blockCount = Math.ceil(paragraphs.length / singleblog.images.length);
                const start = idx * blockCount;
                const end = start + blockCount;
                const htmlBlock = paragraphs.slice(start, end).join("</p>");

                return (
                  <div key={idx} className="space-y-4">
                    {/* Image */}
                    <img
                      src={img}
                      alt={`${singleblog.title} - image ${idx + 1}`}
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                     
                    {/* Corresponding content */}
                    <div
                      className="prose prose-xl max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: htmlBlock + "</p>" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Search</h3>
              <input
                type="text"
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push(`/category/${slugify(e.target.value)}`);
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e65a64]"
              />
            </div>

            {/* Recent Posts */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {recentBlogs?.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/${b.slug}`}
                    className="flex gap-3 items-center group"
                  >
                    {/* Thumbnail */}
                    {b.images?.length > 0 && (
                      <img
                        src={b.images[0]}
                        alt={b.title}
                        className="w-25 h-25 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Title + Meta */}
                    <div>
                      <h4 className="font-semibold text-sm relative inline-block">
                        <span className="bg-gradient-to-r from-red-500 to-red-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 group-hover:bg-[length:100%_2px]">
                          {b.title}
                        </span>
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(b.publishedDate).toLocaleDateString()} •{" "}
                        {Math.ceil(b.content.split(" ").length / 200)} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>


            {/*Categories and tags  */}

            <aside className="p-4">
              <PopularSection />
            </aside>



          </div>





        </div>


        {/*related blogs  */}

        <div className="mt-10 max-w-[1320px]  mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-2xl font-semibold mb-4">Related Posts</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBlogs && relatedBlogs.length > 0 ?
              (relatedBlogs.slice(0, 4).map((post) => (
                <Link
                  key={post._id}
                  href={`/${post.slug}`}
                  className="group cursor-pointer block"
                >
                  {/* Image with zoom effect */}
                  <div className="relative w-full h-48 overflow-hidden rounded-xl">
                    <img
                      src={post?.images?.[0] || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Category */}
                  <p className="mt-3 text-xs text-gray-500">{post.category}</p>

                  {/* Title with underline hover effect */}
                  <h4 className="font-semibold text-sm relative inline-block">
                    <span className="bg-gradient-to-r from-red-500 to-red-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 group-hover:bg-[length:100%_2px]">
                      {post.title}
                    </span>
                  </h4>
                </Link>
              ))) : (
                <p className="text-gray-500 text-sm">No related blogs available</p>
              )}
          </div>
        </div>



      








      </section>
      <Footer />
    </>);
}
