"use client";

import { useEffect, useState } from "react";
import { useCanvasStore } from "@/entities/canvas/model/store";
import { IText } from "@/shared/lib/fabric";

export const TextControls = () => {
  const { canvas, activeObject } = useCanvasStore();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (activeObject && activeObject instanceof IText) {
      setIsBold(activeObject.fontWeight === "bold");
      setIsItalic(activeObject.fontStyle === "italic");
      setIsUnderline(activeObject.underline || false);
      setOpacity(activeObject.opacity || 1);
    }
  }, [activeObject]);

  const updateTextStyle = (style: any) => {
    if (!canvas || !activeObject) return;
    activeObject.set(style);
    canvas.renderAll();
    activeObject.dirty = true;
  };

  if (!activeObject || !(activeObject instanceof IText)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 투명도 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600">투명도</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setOpacity(value);
            updateTextStyle({ opacity: value });
          }}
          className="w-32"
        />
      </div>

      {/* 색상 선택 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">색상</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={activeObject.fill as string}
            onChange={(e) => updateTextStyle({ fill: e.target.value })}
            className="w-8 h-8 rounded border border-gray-200 p-0.5"
          />
          <span className="text-sm text-gray-600">
            {activeObject.fill as string}
          </span>
        </div>
      </div>

      {/* 스타일 버튼 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">스타일</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsBold(!isBold);
              updateTextStyle({ fontWeight: isBold ? "normal" : "bold" });
            }}
            className={`p-2 rounded ${
              isBold ? "bg-blue-100 text-blue-600" : "bg-white text-gray-600"
            } border border-gray-200 hover:bg-gray-50`}
          >
            <span className="material-icons">format_bold</span>
          </button>
          <button
            onClick={() => {
              setIsItalic(!isItalic);
              updateTextStyle({ fontStyle: isItalic ? "normal" : "italic" });
            }}
            className={`p-2 rounded ${
              isItalic ? "bg-blue-100 text-blue-600" : "bg-white text-gray-600"
            } border border-gray-200 hover:bg-gray-50`}
          >
            <span className="material-icons">format_italic</span>
          </button>
          <button
            onClick={() => {
              setIsUnderline(!isUnderline);
              updateTextStyle({ underline: !isUnderline });
            }}
            className={`p-2 rounded ${
              isUnderline
                ? "bg-blue-100 text-blue-600"
                : "bg-white text-gray-600"
            } border border-gray-200 hover:bg-gray-50`}
          >
            <span className="material-icons">format_underlined</span>
          </button>
        </div>
      </div>
    </div>
  );
};
