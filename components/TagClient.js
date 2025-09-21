"use client";

import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PopularSection from "@/components/PopularSection";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function TagClient({ tagSlug }) {
  const router = useRouter();
  const { tagBlogs, fetchTagBlogs, recentBlogs, fetchRecentBlogs } = useBlogStore();
  const [loading, setLoading] = useState(true);

  const slugify = (str) => str?.trim().replace(/\s+/g, "-");
  const deslugify = (str) => str.replace(/-/g, " ").replace(/\s+/g, " ").trim();

  const actualTag = deslugify(tagSlug);

  useEffect(() => {
    if (!tagSlug) return;

    const fetchData = async () => {
      await fetchTagBlogs(actualTag);
      await fetchRecentBlogs();
      setLoading(false);
    };
    fetchData();
  }, [tagSlug]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin border-opacity-70"></div>
      </div>
    );

  if (!tagBlogs || tagBlogs.length === 0)
    return <p className="text-center mt-10">No blogs found</p>;

  return (
    <>
      <Navbar />

      {/* Breadcrumb and Heading */}
      <div className="bg-gray-100 py-6">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-sm text-gray-600 mb-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            › <span className="font-medium capitalize">{actualTag}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tag: <span className="capitalize">{actualTag}</span>
          </h1>
        </div>
      </div>

      <section className="bg-gray-50 py-12">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Blog List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 gap-8">
              {tagBlogs.map((b) => (
                <Link
                  key={b.slug}
                  href={`/${b.slug}`}
                  className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition group"
                >
                  {b.images?.[0] && (
                    <div className="w-full md:w-1/3 overflow-hidden">
                      <img
                        src={b.images[0]}
                        alt={b.title}
                        className="w-full h-60 md:h-full object-cover transform transition duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-between w-full md:w-2/3">
                    <div>
                      <span className="text-red-500 text-xs font-medium uppercase tracking-wider">
                        {b.category}
                      </span>
                      <h2 className="text-2xl font-semibold mt-2 leading-snug">
                        <span className="bg-gradient-to-r from-red-500 to-red-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 group-hover:bg-[length:100%_2px]">
                          {b.title}
                        </span>
                      </h2>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(b.publishedDate).toLocaleDateString()} •{" "}
                        {Math.ceil(b.content.split(" ").length / 200)} min read
                      </p>
                    </div>
                    <div
                      className="text-gray-600 text-sm mt-4 line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: b.content }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-3">Search</h3>
              <input
                type="text"
                placeholder="Search tag ..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push(`/tag/${slugify(e.target.value)}`);
                }}
                className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {recentBlogs?.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/${b.slug}`}
                    className="flex gap-4 items-center group"
                  >
                    {b.images?.[0] && (
                      <img
                        src={b.images[0]}
                        alt={b.title}
                        className="w-25 h-25 object-cover rounded-lg transform transition duration-500 group-hover:scale-110"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-sm">{b.title}</h4>
                      <p className="text-gray-500 text-xs">
                        {new Date(b.publishedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside className="p-4">
              <PopularSection />
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
