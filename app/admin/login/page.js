"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER;
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS;

    if (username === adminUser && password === adminPass) {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin");
    } else {
      setError("Invalid credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center"> Admin Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Login
        </button>

        <p className="text-center text-sm mt-2">
          <Link href="/" className="text-blue-600 hover:underline">
            Go to Home
          </Link>
        </p>
      </form>
    </div>
  );
}
