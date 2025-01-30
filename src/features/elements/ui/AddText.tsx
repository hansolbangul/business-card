"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";
import { IText } from "@/shared/lib/fabric";

let textCount = 1;

export const AddText = () => {
  const { canvas, setActiveObject } = useCanvasStore();

  const handleAddText = () => {
    if (!canvas) return;

    const text = new IText(`텍스트 ${textCount}`, {
      left: 50 + textCount * 10,
      top: 50 + textCount * 10,
      fontSize: 20,
      fill: "#000000",
      fontFamily: "Arial",
    });

    textCount++;

    canvas.add(text);
    canvas.setActiveObject(text);
    setActiveObject(text);
    text.enterEditing();
    text.selectAll();
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
