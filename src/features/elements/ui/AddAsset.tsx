'use client';

import { useCanvasStore } from '@/entities/canvas/model/store';
import { FabricImage } from '@/shared/lib/fabric';

const BASIC_ASSETS = [
  {
    name: '기본 도형',
    assets: [
      '/assets/shapes/circle.svg',
      '/assets/shapes/square.svg',
      '/assets/shapes/triangle.svg',
      '/assets/shapes/star.svg',
    ],
  },
  {
    name: '아이콘',
    assets: [
      '/assets/icons/phone.svg',
      '/assets/icons/email.svg',
      '/assets/icons/location.svg',
      '/assets/icons/web.svg',
    ],
  },
];

export const AddAsset = () => {
  const { canvas } = useCanvasStore();

  const handleAddAsset = async (assetUrl: string) => {
    if (!canvas) return;

    try {
      const imgElement = await new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = assetUrl;
      });

      const fabricImage = new FabricImage(imgElement, {
        left: 10,
        top: 10,
        crossOrigin: 'anonymous',
      });

      // Scale image to reasonable size
      const scale = Math.min(100 / fabricImage.width!, 100 / fabricImage.height!);
      fabricImage.scale(scale);

      canvas.add(fabricImage);
      canvas.setActiveObject(fabricImage);
      canvas.renderAll();
    } catch (error) {
      console.error('Error loading asset:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-600">기본 에셋</h3>
      <div className="space-y-4">
        {BASIC_ASSETS.map((category) => (
          <div key={category.name} className="space-y-2">
            <h4 className="text-xs text-gray-500">{category.name}</h4>
            <div className="grid grid-cols-4 gap-2">
              {category.assets.map((asset) => (
                <button
                  key={asset}
                  onClick={() => handleAddAsset(asset)}
                  className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50"
                >
                  <img src={asset} alt="" className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
