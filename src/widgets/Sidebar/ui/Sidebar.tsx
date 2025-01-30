"use client";

import { motion } from "framer-motion";
import { AddText } from "@/features/elements/ui/AddText";
import { DownloadCard } from "@/features/export/ui/DownloadCard";
import { TextControls } from "@/features/elements/ui/TextControls";
import { LayerControls } from "@/features/elements/ui/LayerControls";
import { modalControl } from "@/shared/lib/modal/modalControl";
import { ModalContent } from "@/features/elements/ui/ModalContent";
import { AddEmoji } from "@/features/elements/ui/AddEmoji";
import { AddAsset } from "@/features/elements/ui/AddAsset";
import { AddImage } from "@/features/elements/ui/AddImage";
import { AddSocialIcon } from "@/features/elements/ui/AddSocialIcon";

export const Sidebar = () => {
  const openModal = (type: string) => {
    const components = {
      emoji: { component: AddEmoji, title: "이모지 추가" },
      asset: { component: AddAsset, title: "에셋 추가" },
    };

    const selected = components[type as keyof typeof components];
    if (!selected) return;

    const Component = selected.component;
    modalControl.open((close) => (
      <ModalContent close={close} title={selected.title}>
        <Component />
      </ModalContent>
    ));
  };

  return (
    <aside className="w-64 fixed left-0 top-16 bottom-0 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* 기본 도구 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black">기본 도구</h2>
          <div className="space-y-4">
            <AddText />
            <AddImage />
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => openModal("emoji")}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 flex flex-col items-center gap-2"
              >
                <span className="material-icons text-2xl">emoji_emotions</span>
                <span className="text-sm">이모지</span>
              </button>
              <button
                onClick={() => openModal("asset")}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 flex flex-col items-center gap-2"
              >
                <span className="material-icons text-2xl">category</span>
                <span className="text-sm">에셋</span>
              </button>
              <AddSocialIcon />
            </div>
          </div>
        </div>

        {/* 레이어 컨트롤 */}
        <motion.div
          initial={false}
          animate={{ height: "auto" }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-black">레이어</h2>
          <LayerControls />
        </motion.div>

        {/* 텍스트 스타일 */}
        <motion.div
          initial={false}
          animate={{ height: "auto" }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-black">텍스트 스타일</h2>
          <TextControls />
        </motion.div>

        {/* 다운로드 */}
        <div className="pt-4 border-t border-gray-200">
          <DownloadCard />
        </div>
      </div>
    </aside>
  );
};
