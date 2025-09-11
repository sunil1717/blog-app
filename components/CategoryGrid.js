"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";

export default function CategoryGrid() {
  const { fetchCategories } = useBlogStore();


  const [categories, setcategories] = useState([])
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchCategories();
      setcategories(res || []);
      setLoading(false);
    };
    loadCategories();
  }, [fetchCategories]);

  //  Slugify helper
  const slugify = (str) =>
    str
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  //  Take only 48 categories


  const limitedCategories = categories.length > 0 ? categories.slice(0, 48) : [];

  return (
    <div className="mt-10 max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20">
      <h2 className="text-2xl font-semibold mb-6">Most Searched Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-6 gap-x-10">
        {loading ? <p className="text-gray-500 text-sm">Loading...</p> :limitedCategories.length > 0 ? (
          limitedCategories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/category/${slugify(cat)}`}
              className="text-gray-700 hover:text-blue-500 text-md"
            >
              {cat.toUpperCase()}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm col-span-6">
            No categories found
          </p>
        )}
      </div>
    </div>
  );
}
