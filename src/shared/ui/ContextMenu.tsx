"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: ReactNode;
}

export const ContextMenu = ({ x, y, onClose, children }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Adjust position if menu would go off screen
  const adjustedPosition = () => {
    if (!menuRef.current) return { x, y };
    
    const menuRect = menuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    if (x + menuRect.width > windowWidth) {
      adjustedX = x - menuRect.width;
    }
    
    if (y + menuRect.height > windowHeight) {
      adjustedY = y - menuRect.height;
    }
    
    return { x: adjustedX, y: adjustedY };
  };

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={{ position: "fixed", left: adjustedPosition().x, top: adjustedPosition().y }}
      className="bg-white rounded-lg shadow-lg py-1 min-w-[120px] z-50"
    >
      {children}
    </motion.div>
  );
};
