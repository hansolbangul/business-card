"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <header
      data-element="header"
      className="fixed top-0 left-0 right-0 h-16 bg-white shadow-lg z-40 border-b border-gray-200"
    >
      <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Business Card
        </Link>
      </div>
    </header>
  );
};
