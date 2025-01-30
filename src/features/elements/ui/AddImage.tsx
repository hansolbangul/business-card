'use client';

import { useCanvasStore } from '@/entities/canvas/model/store';
import { FabricImage } from 'fabric';

export const AddImage = () => {
  const { canvas } = useCanvasStore();

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !canvas) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imgUrl = event.target?.result as string;
        try {
          const imgElement = await new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = imgUrl;
          });

          const fabricImage = new FabricImage(imgElement, {
            crossOrigin: 'anonymous'
          });
          
          // Scale image to fit within the canvas
          const scale = Math.min(
            (canvas.width! - 10) / fabricImage.width!,
            (canvas.height! - 10) / fabricImage.height!
          );
          
          fabricImage.scale(scale);
          canvas.add(fabricImage);
          canvas.setActiveObject(fabricImage);
          canvas.renderAll();
        } catch (error) {
          console.error('Error loading image:', error);
        }
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  return (
    <button
      onClick={handleAddImage}
      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2"
    >
      <span className="material-icons text-gray-500">image</span>
      이미지 추가
    </button>
  );
};
