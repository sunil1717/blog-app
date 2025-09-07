import { create } from "zustand";
import axios from "axios";

// you can later replace localhost:3000 with your deployed domain
const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
});

export const useTrendingStore = create((set) => ({
  trending: [],
  loading: false,
  error: null,

  // Fetch all trending items
  fetchTrending: async () => {
    set({ loading: true, error: null });
    try {
      const res = await API.get("/trending");
      set({ trending: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // Add new trending item
  addTrending: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await API.post("/trending", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        trending: [res.data, ...state.trending],
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // Delete trending item
  deleteTrending: async (id) => {
    set({ loading: true, error: null });
    try {
      await API.delete(`/trending?id=${id}`);
      set((state) => ({
        trending: state.trending.filter((item) => item._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));
