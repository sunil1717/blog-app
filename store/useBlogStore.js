// store/useBlogStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`;
const CATEGORY_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`;
const TAG_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/tags`;

export const useBlogStore = create((set, get) => ({
  blogs: null,
  singleblog: [],
  recentBlogs: [],
  relatedBlogs: [],
  categoryBlogs: [],
  tagBlogs: [],
  loading: false,
  error: null,
  categories: [],
  tags: [],

  // ✅ Fetch all blogs (or by slug)

  fetchBlogs: async () => {


    try {
      set({ loading: true, error: null });


      const url = API_URL;
      const res = await axios.get(url);
      const Ares = JSON.parse(JSON.stringify(res));
      set({ blogs: Ares.data, loading: false });
      return Ares.data;
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  fetchSingleBlogs: async (slug) => {


    try {
      set({ loading: true, error: null });


      const url = slug ? `${API_URL}?slug=${slug}` : API_URL;
      const res = await axios.get(url);
      const Ares = JSON.parse(JSON.stringify(res));
      set({ singleblog: slug ? Ares.data : Ares.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  // Fetch recent posts (e.g., latest 5)
  fetchRecentBlogs: async (excludeSlug) => {
    set({ loading: true, error: null });
    try {
      let url = `${API_URL}?recent=true`;

      if (excludeSlug) {
        url += `&exclude=${excludeSlug}`;
      }

      const res = await axios.get(url);
      set({ recentBlogs: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },


  // Fetch related posts by category/tags excluding current blog
  fetchRelatedBlogs: async (currentBlog) => {
    set({ error: null });

    try {

      const res = await axios.get(
        `${API_URL}?category=${currentBlog.category}`
      );
      // Exclude current blog
      console.log(currentBlog);

      const related = res.data.filter(b => b._id !== currentBlog._id);
      set({ relatedBlogs: related, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },


  // Fetch blogs by category
  fetchCategoryBlogs: async (category) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}?category=${category}`);
      set({ categoryBlogs: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Fetch blogs by tag
  fetchTagBlogs: async (tag) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}?tag=${tag}`);
      set({ tagBlogs: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },


  // fetch all unique category and tags

  fetchCategories: async () => {
    try {
      const res = await axios.get(CATEGORY_API_URL);
      set({ categories: res.data.categories || [] });
      return res.data.categories;
    } catch (err) {
      set({ error: err.message });
    }
  },

  fetchTags: async () => {
    try {
      const res = await axios.get(TAG_API_URL);
      set({ tags: res.data.tags || [] });
      return res.data.tags;
    } catch (err) {
      set({ error: err.message });
    }
  },


  searchBlogs: async (query) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);

      return res.data;
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },









  // ✅ Add new blog (multipart/form-data)
  addBlog: async (formData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ blogs: [res.data, ...get().blogs], loading: false });
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  // ✅ Update blog by slug (multipart/form-data)
  updateBlog: async (formData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Replace updated blog in store
      set({
        blogs: get().blogs.map((b) =>
          b.slug === res.data.slug ? res.data : b
        ),
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },

  // ✅ Delete blog by ID
  deleteBlog: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API_URL}?id=${id}`);
      set({
        blogs: get().blogs.filter((b) => b._id !== id),
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data || err.message, loading: false });
    }
  },
}));
