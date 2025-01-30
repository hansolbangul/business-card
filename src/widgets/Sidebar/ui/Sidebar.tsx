"use client";

import { useState, useEffect } from "react";
import { AddText } from "@/features/elements/ui/AddText";
import { AddImage } from "@/features/elements/ui/AddImage";
import { AddEmoji } from "@/features/elements/ui/AddEmoji";
import { AddAsset } from "@/features/elements/ui/AddAsset";
import { AddSocialIcon } from "@/features/elements/ui/AddSocialIcon";
import { TextControls } from "@/features/elements/ui/TextControls";
import { DownloadCard } from "@/features/export/ui/DownloadCard";
import { LayerControls } from "@/features/elements/ui/LayerControls";
import { BackgroundControls } from "@/features/elements/ui/BackgroundControls";
import { ImageControls } from "@/features/elements/ui/ImageControls";
import { useCanvasStore } from "@/entities/canvas/model/store";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import cn from "classnames";

interface SidebarProps {
  initialIsMobile: boolean;
}

export const Sidebar = ({ initialIsMobile }: SidebarProps) => {
  const { activeObject } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(initialIsMobile);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const openModal = (type: string) => {
    const components = {
      emoji: { component: AddEmoji, title: "이모지 추가" },
      asset: { component: AddAsset, title: "에셋 추가" },
      social: { component: AddSocialIcon, title: "소셜 아이콘 추가" },
    };
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* 기본 도구 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">기본 도구</h2>
        <div className="grid grid-cols-2 gap-3">
          <AddText />
          <AddImage />
          <button
            onClick={() => openModal("emoji")}
            className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="material-icons text-xl">emoji_emotions</span>
            <span className="text-xs">이모지</span>
          </button>
          <button
            onClick={() => openModal("asset")}
            className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="material-icons text-xl">category</span>
            <span className="text-xs">에셋</span>
          </button>
          <button
            onClick={() => openModal("social")}
            className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="material-icons text-xl">share</span>
            <span className="text-xs">소셜</span>
          </button>
        </div>
      </div>

      {/* 편집 도구 */}
      {activeObject && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">편집 도구</h2>
          <div className="space-y-4">
            <TextControls />
            <ImageControls />
            <BackgroundControls />
            <LayerControls />
          </div>
        </div>
      )}

      {/* 내보내기 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">내보내기</h2>
        <DownloadCard />
      </div>
    </div>
  );

  return (
    <>
      {/* 모바일 토글 버튼 */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg"
        >
          <span className="material-icons">edit</span>
        </button>
      )}

      {isMobile ? (
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <SidebarContent />
        </BottomSheet>
      ) : (
        <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <SidebarContent />
          </div>
        </aside>
      )}
    </>
  );
};
