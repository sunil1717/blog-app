"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect } from "react";
import { useTrendingStore } from "@/store/useTrendingStore";
import Link from "next/link";

export default function TrendingTopics() {
  const { trending, fetchTrending, loading, error } = useTrendingStore();


  const slugify = (str) =>
    str?.trim().replace(/\s+/g, "-");

  // Fetch trending items from backend
  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  // custom styling for swiper navigation arrows
  useEffect(() => {
    const styles = `
      .swiper-button-prev, .swiper-button-next {
        background: white;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        opacity: 0.4;
        transition: all 0.3s ease;
      }
      .swiper-button-prev:hover, .swiper-button-next:hover {
        opacity: 1;
        transform: scale(1.1);
      }
      .swiper-button-prev::after, .swiper-button-next::after {
        font-size: 16px;
        font-weight: bold;
        color: #000;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }, []);

  return (
    <section className="bg-[#eef4f7] py-12">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="text-2xl font-bold mb-8 text-black">Trending Topics</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && trending.length > 0 && (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
          >
            {trending.map((topic) => (
              <SwiperSlide key={topic._id}>
                <Link href={`/category/${encodeURIComponent(slugify(topic.title))}`}>
                  <div className="relative rounded-[12px] overflow-hidden cursor-pointer group">
                    {/* Image */}
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-[180px] object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {/* Title */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold text-center">
                      {topic.title}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
