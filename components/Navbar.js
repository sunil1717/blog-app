"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();


  const slugify = (str) =>
    str?.trim().replace(/\s+/g, "-");

  const handleSearch = (e) => {
    e.preventDefault();

    const newquery = slugify(query)

    if (newquery) {
      router.push(`/search?query=${encodeURIComponent(newquery)}`);
    }
  };

  return (
    <nav className="w-full bg-gray-700 shadow-sm px-6 py-3 flex justify-between items-center">
      {/* Left - Logo + Brand */}
      <div className="flex items-center space-x-2">
        <Image
          src="/logo.jpg" // place your logo inside public/logo.png
          alt="Logo"
          width={35}
          height={35}
        />
        <span className="text-xl  text-white font-bold">BLOGAR</span>
      </div>

      {/* Right - Search */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-48 sm:w-64"
      >
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent outline-none flex-1 min-w-0 text-sm"
        />
        <button type="submit" className="hover:cursor-pointer ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </button>
      </form>
    </nav>
  );
}
