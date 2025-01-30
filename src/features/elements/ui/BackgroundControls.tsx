"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";
import { CANVAS_SIZES, MAX_CANVAS_SIZE } from "../model/canvas";
import { modalControl } from "@/shared/lib/modal/modalControl";
import { useState } from "react";

export const BackgroundControls = () => {
  const { canvas } = useCanvasStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    canvas.backgroundColor = e.target.value;
    canvas.renderAll();
  };

  const handleSizeChange = (width: number, height: number) => {
    if (!canvas) return;
    canvas.setDimensions({ width, height });
    canvas.renderAll();
  };

  const handleCustomSize = () => {
    modalControl.open((close) => (
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900">캔버스 크기 설정</h2>
        <CustomSizeForm onSubmit={(width, height) => {
          handleSizeChange(width, height);
          close();
        }} />
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* 배경 크기 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">배경 크기</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleSizeChange(CANVAS_SIZES.MOBILE.width, CANVAS_SIZES.MOBILE.height)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-between"
          >
            <span>{CANVAS_SIZES.MOBILE.label}</span>
            <span className="text-gray-500">
              {CANVAS_SIZES.MOBILE.width} x {CANVAS_SIZES.MOBILE.height}
            </span>
          </button>
          <button
            onClick={() => handleSizeChange(CANVAS_SIZES.BUSINESS_CARD.width, CANVAS_SIZES.BUSINESS_CARD.height)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-between"
          >
            <span>{CANVAS_SIZES.BUSINESS_CARD.label}</span>
            <span className="text-gray-500">
              {CANVAS_SIZES.BUSINESS_CARD.width} x {CANVAS_SIZES.BUSINESS_CARD.height}
            </span>
          </button>
          <button
            onClick={handleCustomSize}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-between"
          >
            <span>커스텀</span>
            <span className="text-gray-500">직접 입력</span>
          </button>
        </div>
      </div>

      {/* 배경색 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">배경색</h3>
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="w-8 h-8 p-0 border-none cursor-pointer"
            defaultValue="#ffffff"
            onChange={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
};

interface CustomSizeFormProps {
  onSubmit: (width: number, height: number) => void;
}

const CustomSizeForm = ({ onSubmit }: CustomSizeFormProps) => {
  const { canvas } = useCanvasStore();
  const [width, setWidth] = useState(canvas?.width?.toString() || "900");
  const [height, setHeight] = useState(canvas?.height?.toString() || "500");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWidth = Math.min(Math.max(100, parseInt(width)), MAX_CANVAS_SIZE.width);
    const newHeight = Math.min(Math.max(100, parseInt(height)), MAX_CANVAS_SIZE.height);
    onSubmit(newWidth, newHeight);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700">
              너비
            </label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min="100"
              max={MAX_CANVAS_SIZE.width}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              높이
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="100"
              max={MAX_CANVAS_SIZE.height}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        적용
      </button>
    </form>
  );
};
