"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";

export default function PopularSection() {
  const { fetchCategories, fetchTags } = useBlogStore();

  const [categories, setcategories] = useState([])
  const [tags, settags] = useState([])

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const loadAll = async () => {
      const dataCat = await fetchCategories(); // wait for async fetch
      setcategories(
        [...dataCat].sort(() => 0.5 - Math.random()).slice(0, 50)
      );

      const dataTag = await fetchTags(); // wait for async fetch
      settags(
        [...dataTag].sort(() => 0.5 - Math.random()).slice(0, 50)
      );

      setLoading(false);

    };
    loadAll();
  }, []);







  // ✅ Slugify helper
  const slugify = (str) =>
    str

      .trim()
      .replace(/\s+/g, "-") // spaces -> dashes
      .replace(/[^\w-]+/g, ""); // remove special chars

  return (
    <div className="mt-10 space-y-10">
      {/* Popular Categories */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
        <div className="flex flex-wrap gap-2">
          {loading ? <p className="text-gray-500 text-sm">Loading...</p> : categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${slugify(cat)}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition"
              >
                {cat}
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No categories found</p>
          )}
        </div>
      </section>

      {/* Popular Tags */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {loading ? <p className="text-gray-500 text-sm">Loading...</p> :tags.length > 0 ? (
            tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${slugify(tag)}`}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition"
              >
                #{tag}
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No tags found</p>
          )}
        </div>
      </section>
    </div>
  );
}
