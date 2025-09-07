"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { useBlogStore } from "@/store/useBlogStore";

export default function TopStories() {
    const {
        categories,
        fetchCategories,
        fetchCategoryBlogs,
        fetchRecentBlogs,
        categoryBlogs,
        recentBlogs,
    } = useBlogStore();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [stories, setStories] = useState([]);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Fetch blogs when category changes
    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryBlogs(selectedCategory);
        } else {
            fetchRecentBlogs();
        }
    }, [selectedCategory, fetchCategoryBlogs, fetchRecentBlogs]);

    // Sync local stories with store
    useEffect(() => {
        if (selectedCategory) {
            setStories(categoryBlogs || []);
        } else {
            setStories(recentBlogs || []);
        }
    }, [selectedCategory, categoryBlogs, recentBlogs]);

    // Split featured (1) + others (max 4)
    const featured = stories.slice(0, 1);
    const others = stories.slice(1, 5);

    return (
        <section className="bg-[#eef4f7]">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20 py-12 ">
            {/* Header Row */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Top Stories</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 border rounded-lg text-sm transition ${!selectedCategory
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 border rounded-lg text-sm transition ${selectedCategory === cat
                                ? "bg-black text-white"
                                : "hover:bg-black hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side */}
                <div className="space-y-6">
                    {others.map((story) => (
                        <div
                            key={story?._id}
                            className="flex items-start gap-4 border-b pb-4 group cursor-pointer"
                        >
                            <Link href={`/blog/${story.slug}`} key={story?._id} className="cursor-pointer">
                                <div className="relative w-[200px] h-[120px] overflow-hidden rounded-md flex-shrink-0">
                                    <img
                                        src={story?.images[0]}
                                        alt={story.title}
                                        className="w-full h-full object-cover transform transition duration-300 group-hover:scale-110"
                                    />
                                </div>
                            </Link>

                            <div>
                                {story.category && (
                                    <Link href={`/blog/category/${story.category}`} className="flip-badge text-xs px-2 py-1 rounded-md cursor-pointer text-red-500 inline-block hover:text-red-600 transition">

                                        <span className="flip-bottom block">{story.category}</span>
                                    </Link>
                                )}

                                <Link href={`/blog/${story.slug}`} key={story?._id} className="cursor-pointer">
                                    <h3 className="font-semibold text-lg relative w-fit">
                                        <span className="bg-gradient-to-r from-red-500 to-red-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 group-hover:bg-[length:100%_2px] group-hover:text-red-500">
                                            {story.title}
                                        </span>
                                    </h3>
                                </Link>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side */}
                <div className="relative w-full h-[600px] rounded-xl overflow-hidden group cursor-pointer">
                    {featured.map((story) => (
                        <div key={story?._id} className="w-full h-full relative">

                            <Link href={`/blog/${story.slug}`} key={story?._id} className="cursor-pointer">
                                <img
                                    src={story?.images[0]}
                                    alt={story.title}
                                    className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110"
                                />
                            </Link>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                {story.category && (
                                    <Link href={`/blog/category/${story.category}`} className="flip-badge text-xs px-2 py-1 rounded-md cursor-pointer text-red-600 inline-block hover:text-red-600 transition">

                                        <span className="flip-bottom block">{story.category}</span>
                                    </Link>
                                )}
                                 <Link href={`/blog/${story.slug}`} key={story?._id} className="cursor-pointer">
                                <h2 className="text-white text-xl font-bold relative w-fit">
                                    <span className="bg-gradient-to-r from-red-400 to-red-400 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 group-hover:bg-[length:100%_2px] group-hover:text-red-400">
                                        {story.title}
                                    </span>
                                </h2>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scoped CSS for flip animation */}
            <style jsx>{`
        .flip-badge {
          position: relative;
          overflow: hidden;
          height: 1.5rem;
        }
        .flip-badge .flip-top,
        .flip-badge .flip-bottom {
          transition: transform 0.32s ease;
        }
        .flip-badge .flip-bottom {
          position: absolute;
          left: 0;
          top: 100%;
        }
        .flip-badge:hover .flip-top,
        .flip-badge:hover .flip-bottom {
          transform: translateY(-100%);
        }
      `}</style>



        </div>
        </section>
    );
}
