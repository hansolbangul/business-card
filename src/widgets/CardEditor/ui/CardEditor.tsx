"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, IText, ActiveSelection } from "@/shared/lib/fabric";
import { useCanvasStore } from "@/entities/canvas/model/store";
import { ContextMenu } from "@/shared/ui/ContextMenu";
import { AnimatePresence } from "framer-motion";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

export const CardEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
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
    if (!canvasRef.current || !wrapperRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: "#ffffff",
      selection: true,
    });

    fabricRef.current = canvas;
    setCanvas(canvas);

    // 캔버스 영역 밖 클릭 감지를 위한 이벤트 리스너
    const handleGlobalClick = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const clickedX = e.clientX - rect.left;
      const clickedY = e.clientY - rect.top;

      // 캔버스 영역 밖을 클릭했는지 확인
      if (
        clickedX < 0 ||
        clickedX > CANVAS_WIDTH ||
        clickedY < 0 ||
        clickedY > CANVAS_HEIGHT
      ) {
        canvas.discardActiveObject();
        setActiveObject(null);
        canvas.requestRenderAll();
      }
    };

    // 전역 클릭 이벤트 리스너 등록
    document.addEventListener("mousedown", handleGlobalClick);

    // 캔버스 클릭 이벤트 처리
    canvas.on("mouse:down", (options) => {
      const pointer = canvas.getPointer(options.e);
      const clickedOutside =
        pointer.x < 0 ||
        pointer.x > CANVAS_WIDTH ||
        pointer.y < 0 ||
        pointer.y > CANVAS_HEIGHT;

      if (clickedOutside) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    });

    // 선택된 객체 처리
    canvas.on("selection:created", (e: any) => {
      setActiveObject(e.selected[0]);
    });

    canvas.on("selection:updated", (e: any) => {
      setActiveObject(e.selected[0]);
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

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!canvas) return;

      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;

      // 텍스트 편집 중일 때는 기본 동작만 허용
      if (activeObject instanceof IText && (activeObject as any).isEditing) {
        return;
      }

      // Delete
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();

        if (activeObject.type === "activeselection") {
          // 다중 선택된 객체들을 모두 삭제
          const activeSelection = activeObject as ActiveSelection;

          const objects = [...activeSelection.getObjects()];
          activeSelection.removeAll();
          objects.forEach((obj) => canvas.remove(obj));
        } else {
          // 단일 객체 삭제
          canvas.remove(activeObject);
        }
        canvas.discardActiveObject();
        canvas.renderAll();
        return;
      }

      // 화살표 키로 위치 미세 조정 (Shift 키와 함께 누르면 10픽셀씩 이동)
      const MOVE_STEP = e.shiftKey ? 10 : 1;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          activeObject.set("left", activeObject.left! - MOVE_STEP);
          canvas.renderAll();
          break;
        case "ArrowRight":
          e.preventDefault();
          activeObject.set("left", activeObject.left! + MOVE_STEP);
          canvas.renderAll();
          break;
        case "ArrowUp":
          e.preventDefault();
          activeObject.set("top", activeObject.top! - MOVE_STEP);
          canvas.renderAll();
          break;
        case "ArrowDown":
          e.preventDefault();
          activeObject.set("top", activeObject.top! + MOVE_STEP);
          canvas.renderAll();
          break;
      }

      // Copy
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        const cloned = await activeObject.clone();
        canvas.clipboard = cloned;
      }

      // Paste
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        if (!canvas.clipboard) return;

        const cloned = await canvas.clipboard.clone();
        canvas.discardActiveObject();
        cloned.set({
          left: cloned.left + 10,
          top: cloned.top + 10,
          evented: true,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
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

    // 이벤트 리스너 등록
    canvasRef.current.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    wrapperRef.current.addEventListener("keydown", handleKeyDown);
    wrapperRef.current.tabIndex = 0; // 키보드 이벤트를 받을 수 있도록 설정
    canvasRef.current.addEventListener("contextmenu", handleContextMenu);

    return () => {
      canvas.dispose();
      document.removeEventListener("mousedown", handleGlobalClick);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("wheel", handleWheel);
        canvasRef.current.removeEventListener("contextmenu", handleContextMenu);
      }
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("keydown", handleKeyDown);
      }
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

  const handleCopy = async () => {
    if (!fabricRef.current) return;

    const activeObject = fabricRef.current.getActiveObject();
    if (activeObject) {
      const cloned = await activeObject.clone();
      fabricRef.current!.clipboard = cloned;
      setContextMenu({ x: 0, y: 0, visible: false });
    }
  };

  const handlePaste = async () => {
    if (!fabricRef.current || !fabricRef.current.clipboard) return;

    const cloned = await fabricRef.current!.clipboard.clone();
    fabricRef.current!.discardActiveObject();
    cloned.set({
      left: cloned.left + 10,
      top: cloned.top + 10,
      evented: true,
    });
    fabricRef.current!.add(cloned);
    fabricRef.current!.setActiveObject(cloned);
    fabricRef.current!.renderAll();
    setContextMenu({ x: 0, y: 0, visible: false });
  };

  return (
    <div className="relative flex-1 overflow-auto">
      <div
        ref={wrapperRef}
        className="relative w-[90vw] lg:w-[900px] h-[500px] mx-auto my-8"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full border border-gray-200 rounded-lg"
        />
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
    </div>
  );
};
