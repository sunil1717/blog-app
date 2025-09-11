"use client";


import { useEffect, useState } from "react";


import FeaturedSection from "@/components/FeaturedSection";
import TrendingTopics from "@/components/TrendingTopics";
import Navbar from "@/components/Navbar";
import TopStories from "@/components/TopStories";
import { useBlogStore } from "@/store/useBlogStore";
import Footer from "@/components/Footer";






function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin border-opacity-70"></div>
    </div>
  );
}



export default function HomePage() {

  const { fetchBlogs, fetchRecentBlogs, recentBlogs } = useBlogStore();

  const [loading, setLoading] = useState(true);
  const [blogs, setblogs] = useState([]);








  useEffect(() => {
    const loadBlogs = async () => {
      const data = await fetchBlogs(); // wait for async fetch
      setblogs(data);
    };
    loadBlogs();
  }, [fetchBlogs]);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);


  if (loading || !blogs || blogs.length === 0) {
    return <Loader />;
  }

  const chunkSize = 5;
  const blogChunks = [];
  for (let i = 0; i < blogs.length; i += chunkSize) {
    blogChunks.push(blogs.slice(i, i + chunkSize));
  }


  return (
    <main>
      <Navbar />

      {blogChunks[0] && <FeaturedSection blogs={blogChunks[0]} />}
      <TrendingTopics />
      <TopStories sectionId="top-stories-1" />
      {blogChunks[1] && <FeaturedSection blogs={blogChunks[1]} />}
      <TopStories sectionId="top-stories-2" />

      {blogChunks.slice(2).map((chunk, index) => (
        <div key={index}>
          <FeaturedSection blogs={chunk} />
        </div>
      ))}

      <Footer />
    </main>
  );
}
