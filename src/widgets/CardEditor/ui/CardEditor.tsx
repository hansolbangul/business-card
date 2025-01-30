"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, IText } from "@/shared/lib/fabric";
import { useCanvasStore } from "@/entities/canvas/model/store";
import { ContextMenu } from "@/shared/ui/ContextMenu";
import { AnimatePresence } from "framer-motion";

export const CardEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { setCanvas, setActiveObject } = useCanvasStore();
  const [zoom, setZoom] = useState(1);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    visible: false,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 900,
      height: 500,
      backgroundColor: "#ffffff",
    });

    fabricRef.current = canvas;
    setCanvas(canvas);

    // 캔버스 클릭 시 컨텍스트 메뉴 닫기
    canvas.on("mouse:down", () => {
      setContextMenu({ x: 0, y: 0, visible: false });
    });

    // 객체 선택 이벤트
    canvas.on("selection:created", (e) => {
      setActiveObject(e.selected?.[0] || null);
    });

    canvas.on("selection:updated", (e) => {
      setActiveObject(e.selected?.[0] || null);
    });

    canvas.on("selection:cleared", () => {
      setActiveObject(null);
    });

    canvas.on("object:moving", (e) => {
      const obj = e.target;
      if (!obj) return;

      const bound = obj.getBoundingRect();
      if (bound.left < 0) {
        obj.left = 0;
      }
      if (bound.top < 0) {
        obj.top = 0;
      }
      if (bound.left + bound.width > canvas.width!) {
        obj.left = canvas.width! - bound.width;
      }
      if (bound.top + bound.height > canvas.height!) {
        obj.top = canvas.height! - bound.height;
      }
    });

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY;
        setZoom((prev) => {
          const newZoom = prev + (delta > 0 ? -0.1 : 0.1);
          return Math.min(Math.max(0.1, newZoom), 3);
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return;

      // Delete
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.renderAll();
          setContextMenu({ x: 0, y: 0, visible: false });
        }
      }

      // Copy
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          activeObject.clone((cloned: any) => {
            canvas.clipboard = cloned;
          });
        }
      }

      // Paste
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        if (canvas.clipboard) {
          canvas.clipboard.clone((clonedObj: any) => {
            canvas.discardActiveObject();
            clonedObj.set({
              left: clonedObj.left + 10,
              top: clonedObj.top + 10,
              evented: true,
            });
            if (clonedObj.type === "activeSelection") {
              clonedObj.canvas = canvas;
              clonedObj.forEachObject((obj: any) => canvas.add(obj));
              clonedObj.setCoords();
            } else {
              canvas.add(clonedObj);
            }
            canvas.setActiveObject(clonedObj);
            canvas.renderAll();
          });
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const pointer = canvas.getPointer(e);
      const target = canvas.findTarget(e);

      if (target) {
        canvas.setActiveObject(target);
        canvas.renderAll();
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          visible: true,
        });
      } else {
        setContextMenu({ x: 0, y: 0, visible: false });
      }
    };

    canvasRef.current.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    window.addEventListener("keydown", handleKeyDown);
    canvasRef.current.addEventListener("contextmenu", handleContextMenu);

    return () => {
      canvas.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("wheel", handleWheel);
        canvasRef.current.removeEventListener("contextmenu", handleContextMenu);
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCanvas, setActiveObject]);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setZoom(zoom);
      fabricRef.current.renderAll();
    }
  }, [zoom]);

  const handleDelete = () => {
    if (!fabricRef.current) return;

    const activeObject = fabricRef.current.getActiveObject();
    if (activeObject) {
      fabricRef.current.remove(activeObject);
      fabricRef.current.renderAll();
      setContextMenu({ x: 0, y: 0, visible: false });
    }
  };

  const handleCopy = () => {
    if (!fabricRef.current) return;

    const activeObject = fabricRef.current.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned: any) => {
        fabricRef.current!.clipboard = cloned;
      });
      setContextMenu({ x: 0, y: 0, visible: false });
    }
  };

  const handlePaste = () => {
    if (!fabricRef.current || !fabricRef.current.clipboard) return;

    fabricRef.current.clipboard.clone((clonedObj: any) => {
      fabricRef.current!.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === "activeSelection") {
        clonedObj.canvas = fabricRef.current;
        clonedObj.forEachObject((obj: any) => fabricRef.current!.add(obj));
        clonedObj.setCoords();
      } else {
        fabricRef.current!.add(clonedObj);
      }
      fabricRef.current!.setActiveObject(clonedObj);
      fabricRef.current!.renderAll();
    });
    setContextMenu({ x: 0, y: 0, visible: false });
  };

  return (
    <div className="w-full h-full overflow-auto bg-white relative">
      <div className="min-h-full p-8 flex items-center justify-center">
        <div
          className="border border-gray-200 rounded shadow-lg"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>
      </div>

      <AnimatePresence>
        {contextMenu.visible && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu({ x: 0, y: 0, visible: false })}
          >
            <button
              onClick={handleCopy}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <span className="material-icons text-sm">content_copy</span>
              복사
            </button>
            <button
              onClick={handlePaste}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <span className="material-icons text-sm">content_paste</span>
              붙여넣기
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <span className="material-icons text-sm">delete</span>
              삭제
            </button>
          </ContextMenu>
        )}
      </AnimatePresence>
    </div>
  );
};
