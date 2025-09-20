"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
              priority
              onError={() => console.error("Failed to load logo")}
            />
            <span className="text-blue-600 font-semibold text-lg">
              E-OPROGEM
            </span>
          </Link>

          {/* Navigation and Auth Section */}
          <div className="flex items-center gap-5">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/register"
                aria-label="Créer un compte"
                className="px-4 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                S'inscrire
              </Link>
              <Link
                href="/login"
                aria-label="Se connecter à votre compte"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="flex flex-col p-4 gap-4">
            
              <Link
                href="/register"
                aria-label="Créer un compte"
                className="px-4 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                S'inscrire
              </Link>
              <Link
                href="/login"
                aria-label="Se connecter à votre compte"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Connexion
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}