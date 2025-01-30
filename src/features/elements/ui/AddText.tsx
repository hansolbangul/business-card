'use client';

import { useCanvasStore } from '@/entities/canvas/model/store';
import { IText } from '@/shared/lib/fabric';

export const AddText = () => {
  const { canvas } = useCanvasStore();

  const handleAddText = () => {
    if (!canvas) return;

    const text = new IText('텍스트를 입력하세요', {
      left: 10,
      top: 10,
      fontSize: 12,
      fill: '#000000',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  return (
    <button
      onClick={handleAddText}
      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2"
    >
      <span className="material-icons text-gray-500">text_fields</span>
      텍스트 추가
    </button>
  );
};
