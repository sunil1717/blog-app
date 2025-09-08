"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";

export default function Footer() {
  const { fetchCategories } = useBlogStore();


  const [categories, setcategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchCategories();
      setcategories(res || []);
    };
    loadCategories();
  }, [fetchCategories]);

  const footerCategories = Array.isArray(categories) && categories.length > 0
    ? [...categories].sort(() => 0.5 - Math.random()).slice(0, 15)
    : [];

  // Slugify helper
  const slugify = (str) =>
    str.trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">About Us</h2>
            <p className="text-sm leading-relaxed">
              We share stories, guides, and insights to keep you updated and
              inspired every day.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-3 gap-y-2">
              {footerCategories.length > 0 ? (
                footerCategories.map((cat, idx) => (
                  <Link
                    key={idx}
                    href={`/blog/category/${slugify(cat)}`}
                    className="hover:text-white transition text-sm"
                  >
                    {cat}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm col-span-3">
                  No categories found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Blogger. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
