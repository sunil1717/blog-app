"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";

export default function PopularSection() {
  const { categories, tags, fetchCategories, fetchTags } = useBlogStore();

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  // Shuffle and take 50 items
  const randomCategories = [...categories]
    .sort(() => 0.5 - Math.random())
    .slice(0, 50);

  const randomTags = [...tags]
    .sort(() => 0.5 - Math.random())
    .slice(0, 50);

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
          {randomCategories.length > 0 ? (
            randomCategories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${slugify(cat)}`}
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
          {randomTags.length > 0 ? (
            randomTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${slugify(tag)}`}
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
