"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";
import { FabricImage } from "@/shared/lib/fabric";
import Image from "next/image";

const BASIC_ASSETS = [
  {
    name: "chill guy 밈",
    assets: ["/assets/chill-guy.webp", "/assets/chill-background.jpg"],
  },
  // {
  //   name: "아이콘",
  //   assets: [
  //     "/assets/icons/phone.svg",
  //     "/assets/icons/email.svg",
  //     "/assets/icons/location.svg",
  //     "/assets/icons/web.svg",
  //   ],
  // },
];

interface AddAssetProps {
  close: () => void;
}

export const AddAsset = ({ close }: AddAssetProps) => {
  const { canvas } = useCanvasStore();

  const handleAssetClick = async (assetPath: string) => {
    if (!canvas) return;

    try {
      const imgElement = document.createElement("img");
      imgElement.src = assetPath;
      await new Promise((resolve) => (imgElement.onload = resolve));

      const fabricImage = new FabricImage(imgElement, {
        left: 10,
        top: 10,
        crossOrigin: "anonymous",
      });

      // Scale image to reasonable size
      const scale = Math.min(
        100 / fabricImage.width!,
        100 / fabricImage.height!
      );
      fabricImage.scale(scale);

      canvas.add(fabricImage);
      canvas.bringObjectForward(fabricImage, true); // 새로 추가된 이미지를 맨 앞으로 가져옴
      canvas.setActiveObject(fabricImage);
      canvas.renderAll();
      close();
    } catch (error) {
      console.error("Failed to load asset:", error);
    }
  };

  return (
    <div className="p-4">
      {BASIC_ASSETS.map((category) => (
        <div key={category.name} className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {category.name}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {category.assets.map((asset) => (
              <button
                key={asset}
                onClick={() => handleAssetClick(asset)}
                className="aspect-square bg-white border border-gray-200 rounded hover:bg-gray-50 p-2 relative"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={asset}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
