"use client";

import { CloseModalFn } from "@/shared/lib/modal/types";
import { ReactNode } from "react";

interface ModalContentProps {
  close: CloseModalFn;
  title: string;
  children: ReactNode;
}

export const ModalContent = ({ close, title, children }: ModalContentProps) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-[320px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button onClick={close} className="text-gray-400 hover:text-gray-500">
          <span className="material-icons">close</span>
        </button>
      </div>
      {children}
    </div>
  );
};
