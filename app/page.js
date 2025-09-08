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

  const { blogs, fetchBlogs, fetchRecentBlogs, recentBlogs } = useBlogStore();

   const [loading, setLoading] = useState(true);







  useEffect(() => {
     fetchBlogs()
   }, [fetchBlogs])

  
   useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);
  

  if (loading) {
    return <Loader />;
  }
   

  

  return (
    <main>
      <Navbar />
      <FeaturedSection blogs={blogs}  />
      <TrendingTopics />
      <TopStories sectionId="top-stories-1" />
      <FeaturedSection blogs={blogs} />
      <TopStories sectionId="top-stories-2" />

    <Footer/>
    </main>
  );
}
