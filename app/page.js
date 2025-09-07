"use client";


import { useEffect, useState } from "react";


import FeaturedSection from "@/components/FeaturedSection";
import TrendingTopics from "@/components/TrendingTopics";
import Navbar from "@/components/Navbar";
import TopStories from "@/components/TopStories";
import { useBlogStore } from "@/store/useBlogStore";
import Footer from "@/components/Footer";




export default function HomePage() {

  const { blogs, fetchBlogs, fetchRecentBlogs, recentBlogs } = useBlogStore();

   


  useEffect(() => {
     fetchBlogs()
   }, [fetchBlogs])

   console.log(blogs);
   
   

  

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
