"use client";
import { useState, useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { useTrendingStore } from "@/store/useTrendingStore";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

export default function AdminPage() {
  const { blogs, fetchBlogs, addBlog, deleteBlog, loading, error } = useBlogStore();

  const {
    trending,
    fetchTrending,
    addTrending,
    deleteTrending,
    loading: trendingLoading,
    error: trendingError,
  } = useTrendingStore();

  // Tabs
  const [activeTab, setActiveTab] = useState("blogs");

  // Blog Form State
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaContent, setMetaContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([null, null, null]);

  // Trending Form State
  const [trendingTitle, setTrendingTitle] = useState("");
  const [trendingImage, setTrendingImage] = useState(null);

  const [previews, setPreviews] = useState([null, null, null]);


  useEffect(() => {
    fetchBlogs();
    fetchTrending();
  }, [fetchBlogs, fetchTrending]);

  // Blog Image Change
  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    if (file && typeof window !== "undefined") {
      // Revoke previous preview if exists
      if (previews[index]) URL.revokeObjectURL(previews[index]);

      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };




  // Submit Blog
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("metaTitle", metaTitle);
    formData.append("content", content);
    formData.append("metaContent", metaContent);
    formData.append("tags", tags);
    formData.append("category", category);
    images.forEach((img) => {
      if (img) formData.append("images", img);
    });
    await addBlog(formData);

    previews.forEach(url => url && URL.revokeObjectURL(url));
    setTitle("");
    setMetaTitle("");
    setContent("");
    setMetaContent("");
    setTags("");
    setCategory("");
    setImages([null, null, null]);
    setPreviews([null, null, null]);
  };




  const [trendingPreview, setTrendingPreview] = useState(null);

  // on file change
  const handleTrendingImageChange = (file) => {
    if (trendingPreview) URL.revokeObjectURL(trendingPreview);
    setTrendingImage(file);
    setTrendingPreview(file ? URL.createObjectURL(file) : null);
  };



  // Submit Trending
  const handleSubmitTrending = async (e) => {
    e.preventDefault();
    if (!trendingTitle || !trendingImage) return;

    const formData = new FormData();
    formData.append("title", trendingTitle);
    formData.append("image", trendingImage);

    await addTrending(formData);

    if (trendingPreview) URL.revokeObjectURL(trendingPreview);
    setTrendingTitle("");
    setTrendingImage(null);
    setTrendingPreview(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin border-opacity-70"></div>
    </div>
  );

  if (!blogs) return <p className="text-center mt-10">No Blogs Found</p>;


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛠 Admin Panel</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-4 py-2 rounded ${activeTab === "blogs"
            ? "bg-green-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          Blogs
        </button>
        <button
          onClick={() => setActiveTab("trending")}
          className={`px-4 py-2 rounded ${activeTab === "trending"
            ? "bg-green-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          Trending
        </button>
      </div>

      {/* Error & Loading */}
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Blogs Tab */}
      {activeTab === "blogs" && (
        <>
          {/* Add Blog Form */}
          <form
            onSubmit={handleSubmitBlog}
            className="mb-10 space-y-4 bg-gray-100 p-6 rounded-lg"
          >
            <h2 className="text-xl font-semibold">➕ Add New Blog</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Meta Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <label className="block font-medium">Blog Content:</label>
            <RichTextEditor value={content} onChange={setContent} />

            <textarea
              placeholder="Meta Content"
              value={metaContent}
              onChange={(e) => setMetaContent(e.target.value)}
              className="w-full p-2 border rounded h-20"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <label className="block font-medium">Upload up to 3 Images:</label>
            {images.map((img, index) => (
              <div key={index} className="mb-2">
                <input
                  type="file"
                  onChange={(e) => e.target.files[0] && handleImageChange(index, e.target.files[0])}
                  className="w-full"
                />

                {previews[index] && (
                  <img
                    src={previews[index]}
                    alt={`preview-${index}`}
                    className="mt-2 w-32 h-32 object-cover rounded border"
                  />
                )}

              </div>
            ))}

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Blog
            </button>
          </form>

          {/* Blog List */}
          <h2 className="text-xl font-semibold mb-4">📃 All Blogs</h2>
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="p-4 bg-white shadow rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">{blog.title}</h3>
                  <p className="text-sm text-gray-600">{blog.category}</p>
                </div>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Trending Tab */}
      {activeTab === "trending" && (
        <>
          {/* Add Trending Form */}
          <form
            onSubmit={handleSubmitTrending}
            className="mb-10 space-y-4 bg-gray-100 p-6 rounded-lg"
          >
            <h2 className="text-xl font-semibold">🔥 Add Trending Item</h2>

            <input
              type="text"
              placeholder="Trending Title"
              value={trendingTitle}
              onChange={(e) => setTrendingTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <input
              type="file"
              onChange={(e) => e.target.files[0] && handleTrendingImageChange(e.target.files[0])}
              className="w-full"
              required
            />


            {trendingPreview && (
              <img
                src={trendingPreview}
                alt="trending-preview"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}


            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Trending
            </button>
          </form>


          {/* Error & Loading */}
          {trendingLoading && <p className="text-blue-500">Loading...</p>}
          {trendingError && <p className="text-red-500">{trendingError}</p>}

          {/* Trending List */}
          <h2 className="text-xl font-semibold mb-4">📌 All Trending Items</h2>
          <div className="space-y-4">
            {trending.map((item) => (
              <div
                key={item._id}
                className="p-4 bg-white shadow rounded flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <button
                  onClick={() => deleteTrending(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
