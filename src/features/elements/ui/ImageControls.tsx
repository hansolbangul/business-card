"use client";

import { useEffect, useState } from "react";
import { useCanvasStore } from "@/entities/canvas/model/store";
import { FabricImage } from "@/shared/lib/fabric";

export const ImageControls = () => {
  const { canvas, activeObject } = useCanvasStore();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (activeObject && activeObject instanceof FabricImage) {
      setOpacity(activeObject.opacity || 1);
    }
  }, [activeObject]);

  if (!activeObject || !(activeObject instanceof FabricImage)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-600">이미지 설정</h3>
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
            if (!canvas || !activeObject) return;
            activeObject.set('opacity', value);
            canvas.renderAll();
          }}
          className="w-32"
        />
      </div>
    </div>
  );
};
