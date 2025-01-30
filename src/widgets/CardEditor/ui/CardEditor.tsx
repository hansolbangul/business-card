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
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });

  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current) return;

    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? window.innerWidth - 32 : CANVAS_WIDTH;
      const height = isMobile
        ? width * (CANVAS_HEIGHT / CANVAS_WIDTH)
        : CANVAS_HEIGHT;

      setCanvasSize({ width, height });

      if (fabricRef.current) {
        fabricRef.current.setDimensions({ width, height });
        fabricRef.current.renderAll();
      }
    };

    // 초기 캔버스 크기 설정
    updateCanvasSize();

    // Canvas 초기화
    const canvas = new Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: "#ffffff",
      selection: window.innerWidth >= 768,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;
    setCanvas(canvas);

    // 객체 선택 이벤트
    canvas.on("selection:created", (options) => {
      const selectedObject = options.selected?.[0];
      if (selectedObject) {
        setActiveObject(selectedObject);
      }
    });

    canvas.on("selection:updated", (options) => {
      const selectedObject = options.selected?.[0];
      if (selectedObject) {
        setActiveObject(selectedObject);
      }
    });

    canvas.on("selection:cleared", () => {
      setActiveObject(null);
    });

    // 모바일에서 드래그 제한
    canvas.on("mouse:down", (e) => {
      if (window.innerWidth < 768) {
        const target = e.target;
        if (target) {
          target.selectable = true;
          canvas.setActiveObject(target);
        }
        canvas.selection = false;
      }
    });

    // 객체가 캔버스 밖으로 나가지 않도록 제한
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
      if (bound.left + bound.width > canvasSize.width) {
        obj.left = canvasSize.width - bound.width;
      }
      if (bound.top + bound.height > canvasSize.height) {
        obj.top = canvasSize.height - bound.height;
      }
    });

    // 키보드 이벤트 처리
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

      // 화살표 키로 위치 미세 조정
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

      // Copy & Paste
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        const cloned = await activeObject.clone();
        canvas.clipboard = cloned;
      }

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

    // 우클릭 메뉴
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
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
    wrapperRef.current.addEventListener("keydown", handleKeyDown);
    wrapperRef.current.tabIndex = 0;
    canvasRef.current.addEventListener("contextmenu", handleContextMenu);

    // 리사이즈 이벤트
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", updateCanvasSize);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("contextmenu", handleContextMenu);
      }
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

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
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div
        ref={wrapperRef}
        className="relative bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      >
        <canvas ref={canvasRef} />
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
