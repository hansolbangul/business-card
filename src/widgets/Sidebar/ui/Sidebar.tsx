"use client";

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
import { BackgroundControls } from "@/features/elements/ui/BackgroundControls";
import { ImageControls } from "@/features/elements/ui/ImageControls";

export const Sidebar = () => {
  const openModal = (type: string) => {
    const components = {
      emoji: { component: AddEmoji, title: "이모지 추가" },
      asset: { component: AddAsset, title: "에셋 추가" },
      social: { component: AddSocialIcon, title: "소셜 아이콘 추가" },
    };

    const selected = components[type as keyof typeof components];
    if (!selected) return;

    const Component = selected.component;
    modalControl.open((close) => (
      <ModalContent close={close} title={selected.title}>
        <Component close={close} />
      </ModalContent>
    ));
  };

  return (
    <aside
      className={`
      w-full lg:w-64 bg-white shadow-lg border-gray-200 overflow-y-auto
      lg:fixed lg:z-10 lg:left-0 lg:top-16 lg:bottom-0 lg:border-r
      border-t lg:border-t-0
    `}
    >
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* 기본 도구 */}
        <div className="space-y-2 lg:space-y-4">
          <h2 className="text-lg font-semibold text-black">기본 도구</h2>
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            <AddText />
            <AddImage />
          </div>
          <div className="grid gap-3 grid-cols-2">
            <button
              onClick={() => openModal("emoji")}
              className="flex-shrink-0 p-3 lg:p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 flex flex-col items-center gap-2"
            >
              <span className="material-icons text-xl lg:text-2xl">
                emoji_emotions
              </span>
              <span className="text-xs lg:text-sm">이모지</span>
            </button>
            <button
              onClick={() => openModal("asset")}
              className="flex-shrink-0 p-3 lg:p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 flex flex-col items-center gap-2"
            >
              <span className="material-icons text-xl lg:text-2xl">
                category
              </span>
              <span className="text-xs lg:text-sm">에셋</span>
            </button>
            <button
              onClick={() => openModal("social")}
              className="flex-shrink-0 p-3 lg:p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 flex flex-col items-center gap-2"
            >
              <span className="material-icons text-xl lg:text-2xl">share</span>
              <span className="text-xs lg:text-sm">소셜</span>
            </button>
          </div>
        </div>

        {/* 편집 도구 */}
        <div className="space-y-2 lg:space-y-4">
          <h2 className="text-lg font-semibold text-black">편집 도구</h2>
          <div className="space-y-3">
            <TextControls />
            <ImageControls />
            <BackgroundControls />
            <LayerControls />
          </div>
        </div>

        {/* 내보내기 */}
        <div className="space-y-2 lg:space-y-4">
          <h2 className="text-lg font-semibold text-black">내보내기</h2>
          <DownloadCard />
        </div>
      </div>
    </aside>
  );
};
