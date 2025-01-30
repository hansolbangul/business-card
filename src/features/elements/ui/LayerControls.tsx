"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";

export const LayerControls = () => {
  const { canvas, activeObject } = useCanvasStore();

  const bringForward = () => {
    if (!canvas || !activeObject) return;
    canvas.bringObjectForward(activeObject);
    canvas.renderAll();
  };

  const sendBackward = () => {
    if (!canvas || !activeObject) return;
    canvas.sendObjectBackwards(activeObject);
    canvas.renderAll();
  };

  const bringToFront = () => {
    if (!canvas || !activeObject) return;
    canvas.bringObjectToFront(activeObject);
    canvas.renderAll();
  };

  const sendToBack = () => {
    if (!canvas || !activeObject) return;
    canvas.sendObjectToBack(activeObject);
    canvas.renderAll();
  };

  if (!activeObject) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-600">레이어 순서</h3>
      <div className="flex items-center gap-2">
        <button
          onClick={bringToFront}
          className="p-2 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
        >
          <span className="material-icons">vertical_align_top</span>
        </button>
        <button
          onClick={bringForward}
          className="p-2 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
        >
          <span className="material-icons">keyboard_arrow_up</span>
        </button>
        <button
          onClick={sendBackward}
          className="p-2 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
        >
          <span className="material-icons">keyboard_arrow_down</span>
        </button>
        <button
          onClick={sendToBack}
          className="p-2 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
        >
          <span className="material-icons">vertical_align_bottom</span>
        </button>
      </div>
    </div>
  );
};
