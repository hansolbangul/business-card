"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";
import { IText } from "@/shared/lib/fabric";

let textCount = 1;

export const AddText = () => {
  const { canvas, setActiveObject } = useCanvasStore();

  const handleAddText = () => {
    if (!canvas) return;

    const text = new IText("텍스트를 입력하세요", {
      left: 10,
      top: 10,
      fontSize: 20,
      fill: "#000000",
    });

    canvas.add(text);
    canvas.bringObjectForward(text, true); // 새로 추가된 텍스트를 맨 앞으로 가져옴
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  };

  return (
    <button
      onClick={handleAddText}
      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
    >
      <span className="material-icons">text_fields</span>
      텍스트 추가
    </button>
  );
};
