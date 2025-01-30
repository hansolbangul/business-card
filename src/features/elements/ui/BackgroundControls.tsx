"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";

export const BackgroundControls = () => {
  const { canvas } = useCanvasStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    canvas.backgroundColor = e.target.value;
    canvas.renderAll();
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <label
          htmlFor="background-color"
          className="text-sm font-medium text-gray-700"
        >
          배경색
        </label>
        <input
          id="background-color"
          type="color"
          className="w-8 h-8 p-0 border-none cursor-pointer"
          defaultValue="#ffffff"
          onChange={handleColorChange}
        />
      </div>
    </div>
  );
};
