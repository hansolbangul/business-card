"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";
import { IText } from "@/shared/lib/fabric";
import { useEffect, useState } from "react";

export const TextControls = () => {
  const { canvas, activeObject } = useCanvasStore();
  const [textColor, setTextColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // activeObject가 변경될 때마다 스타일 상태 업데이트
  useEffect(() => {
    if (activeObject && activeObject instanceof IText) {
      setTextColor(activeObject.fill as string);
      setIsBold(activeObject.fontWeight === "bold");
      setIsItalic(activeObject.fontStyle === "italic");
      setIsUnderline(activeObject.underline || false);
    }
  }, [activeObject]);

  const updateTextStyle = (style: Partial<IText>) => {
    if (!canvas || !activeObject || !(activeObject instanceof IText)) return;

    // 스타일 업데이트
    Object.assign(activeObject, style);
    activeObject.set(style);
    
    // 캔버스 업데이트
    canvas.requestRenderAll();
    activeObject.dirty = true;
  };

  if (!activeObject || !(activeObject instanceof IText)) {
    return (
      <div className="text-sm text-gray-500 text-center p-4">
        텍스트를 선택하면 스타일을 변경할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 색상 선택 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">색상</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              const color = e.target.value;
              setTextColor(color);
              updateTextStyle({ fill: color });
            }}
            className="w-8 h-8 rounded border border-gray-200 p-0.5"
          />
          <span className="text-sm text-gray-600">{textColor}</span>
        </div>
      </div>

      {/* 스타일 버튼 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">스타일</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newBold = !isBold;
              setIsBold(newBold);
              updateTextStyle({ fontWeight: newBold ? "bold" : "normal" });
            }}
            className={`p-2 rounded ${
              isBold ? "bg-blue-100 text-blue-600" : "bg-white text-gray-600"
            } border border-gray-200 hover:bg-gray-50`}
          >
            <span className="material-icons">format_bold</span>
          </button>
          <button
            onClick={() => {
              const newItalic = !isItalic;
              setIsItalic(newItalic);
              updateTextStyle({ fontStyle: newItalic ? "italic" : "normal" });
            }}
            className={`p-2 rounded ${
              isItalic ? "bg-blue-100 text-blue-600" : "bg-white text-gray-600"
            } border border-gray-200 hover:bg-gray-50`}
          >
            <span className="material-icons">format_italic</span>
          </button>
          <button
            onClick={() => {
              const newUnderline = !isUnderline;
              setIsUnderline(newUnderline);
              updateTextStyle({ underline: newUnderline });
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
