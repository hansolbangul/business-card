"use client";

import Link from "next/link";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaBlog } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RiMenu3Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const socialLinks = [
    {
      icon: <FaGithub className="text-2xl" />,
      href: "https://github.com/hansolbangul",
      label: "GitHub",
    },
    {
      icon: <FaLinkedin className="text-2xl" />,
      href: "https://www.linkedin.com/in/hansolbangul",
      label: "LinkedIn",
    },
    {
      icon: <FaBlog className="text-2xl" />,
      href: "https://blog.hansolbangul.com",
      label: "Blog",
    },
    {
      icon: <CgProfile className="text-2xl" />,
      href: "https://profile.hansolbangul.com",
      label: "Profile",
    },
  ];

  const menuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  return (
    <header
      data-element="header"
      className="fixed top-0 left-0 right-0 bg-white shadow-lg z-[46] border-b border-gray-200"
    >
      <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          Business Card
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden text-gray-600 hover:text-blue-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
        >
          <RiMenu3Line className="text-2xl" />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="px-4 py-4">
              {socialLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  custom={i}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    href={link.href}
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors py-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
