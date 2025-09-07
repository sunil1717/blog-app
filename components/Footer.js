"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">About Us</h2>
            <p className="text-sm leading-relaxed">
              We share stories, guides, and insights to keep you updated and
              inspired every day.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              
              
             
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition">Facebook</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Blogger. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
