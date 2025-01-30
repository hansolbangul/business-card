"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";

export const DownloadCard = () => {
  const { canvas } = useCanvasStore();

  const handleDownload = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement("a");
    link.download = "business-card.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center"
    >
      <span className="material-icons">download</span>
      명함 다운로드
    </button>
  );
};
