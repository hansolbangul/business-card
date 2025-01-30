"use client";

import { FaHeart } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto z-[41]">
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-gray-600 flex items-center gap-2">
            Made with <FaHeart className="text-red-500" /> by Hansol Ji
          </p>
          <div className="text-sm text-gray-500">
            <p>Create and customize your own business card</p>
            <p>
              © {new Date().getFullYear()} Business Card. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
