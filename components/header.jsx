"use client";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white fixed top-0 left-0 w-full z-40 shadow-[0_4px_10px_rgba(59,130,246,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="E-OPROGEM Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-blue-600 font-semibold text-lg">
              E-OPROGEM
            </span>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center gap-5">
            {/* Text Links */}
            <Link
              href="/police-register"
              className="text-gray-600 hover:text-gray-900 transition text-sm"
            >
              Police  
            </Link>
            <Link
              href="/admin-register"
              className="text-gray-600 hover:text-gray-900 transition text-sm"
            >
              Admin 
            </Link>

            {/* Buttons */}
            <Link
              href="/register"
              className="px-4 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
