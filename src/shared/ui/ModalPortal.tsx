"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { modalControl } from "../lib/modal/modalControl";
import { ModalContentFn } from "../lib/modal/types";

export const ModalPortal = () => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<ModalContentFn | null>(null);

  useEffect(() => {
    // Create portal element if it doesn't exist
    let element = document.getElementById("modal-portal");
    if (!element) {
      element = document.createElement("div");
      element.id = "modal-portal";
      document.body.appendChild(element);
    }
    setPortalElement(element);

    // Subscribe to modal events
    const unsubscribe = modalControl.subscribe((event) => {
      if (event.type === "OPEN_MODAL" && event.payload?.content) {
        setContent(() => event.payload.content);
      } else if (event.type === "CLOSE_MODAL") {
        setContent(null);
      }
    });

    return () => {
      unsubscribe();
      element?.remove();
    };
  }, []);

  if (!portalElement || !content) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={() => modalControl.close()}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
      >
        {content(() => modalControl.close())}
      </motion.div>
    </AnimatePresence>,
    portalElement
  );
};
