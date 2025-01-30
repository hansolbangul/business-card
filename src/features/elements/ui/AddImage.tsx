'use client';

import { useCanvasStore } from '@/entities/canvas/model/store';
import { FabricImage } from '@/shared/lib/fabric';
import { useRef } from 'react';

export const AddImage = () => {
  const { canvas } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) return;

      const imgElement = document.createElement('img');
      imgElement.src = event.target.result as string;

      imgElement.onload = () => {
        const fabricImage = new FabricImage(imgElement, {
          left: 50,
          top: 50,
          scaleX: 0.5,
          scaleY: 0.5,
        });

        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);
        canvas.renderAll();
      };
    };

    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-icons">add</span>
        이미지 추가
      </button>
    </>
  );
};
