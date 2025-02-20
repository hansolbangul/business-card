"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, IText, ActiveSelection } from "@/shared/lib/fabric";
import { useCanvasStore } from "@/entities/canvas/model/store";
import { ContextMenu } from "@/shared/ui/ContextMenu";
import { AnimatePresence } from "framer-motion";
import { CANVAS_SIZES } from "@/features/elements/model/canvas";

interface Props {
  initialIsMobile: boolean;
}

export const CardEditor = ({ initialIsMobile }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [isMobile, setIsMobile] = useState(initialIsMobile);
  const { setCanvas, setActiveObject } = useCanvasStore();
  const [zoom] = useState(1);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    visible: false,
  });

  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({
    width: initialIsMobile
      ? CANVAS_SIZES.MOBILE.width
      : CANVAS_SIZES.BUSINESS_CARD.width,
    height: initialIsMobile
      ? CANVAS_SIZES.MOBILE.height
      : CANVAS_SIZES.BUSINESS_CARD.height,
  });

  // 모바일 상태 감지
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모바일 상태 변경 시 캔버스 크기 업데이트
  useEffect(() => {
    if (!fabricRef.current) return;

    const width = isMobile
      ? CANVAS_SIZES.MOBILE.width
      : CANVAS_SIZES.BUSINESS_CARD.width;
    const height = isMobile
      ? CANVAS_SIZES.MOBILE.height
      : CANVAS_SIZES.BUSINESS_CARD.height;

    setCanvasSize({ width, height });
    fabricRef.current.setDimensions({ width, height });
    fabricRef.current.renderAll();
  }, [isMobile]);

  // 캔버스 초기화
  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;
    setCanvas(canvas);

    // 모바일에서 드래그 제한
    canvas.on("mouse:down", (e) => {
      if (isMobile) {
        const target = e.target;
        if (target) {
          target.selectable = true;
          canvas.setActiveObject(target);
        }
        canvas.selection = false;
      }
    });

    canvas.on("selection:created", (options) => {
      const selectedObject = options.selected?.[0];
      if (selectedObject) {
        setActiveObject(selectedObject);
        if (isMobile) {
          showMobileDeleteButton(selectedObject);
        }
      }
    });

    canvas.on("selection:updated", (options) => {
      const selectedObject = options.selected?.[0];
      if (selectedObject) {
        setActiveObject(selectedObject);
        if (isMobile) {
          showMobileDeleteButton(selectedObject);
        }
      }
    });

    canvas.on("selection:cleared", () => {
      setActiveObject(null);
      removeMobileDeleteButton();
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [setCanvas, setActiveObject]);

  // 모바일 삭제 버튼 표시 함수
  const showMobileDeleteButton = (selectedObject: any) => {
    removeMobileDeleteButton();

    const bound = selectedObject.getBoundingRect();
    const deleteBtn = document.createElement("button");
    deleteBtn.className =
      "mobile-delete-btn absolute bg-white w-6 h-6 rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-red-50 z-10";
    deleteBtn.style.left = `${bound.left + bound.width / 2 - 12}px`;
    deleteBtn.style.top = `${bound.top - 24}px`;
    deleteBtn.innerHTML =
      '<span class="material-icons text-red-500 text-base leading-none">close</span>';
    deleteBtn.onclick = () => {
      fabricRef.current?.remove(selectedObject);
      fabricRef.current?.renderAll();
      deleteBtn.remove();
    };

    wrapperRef.current?.appendChild(deleteBtn);

    selectedObject.on("moving", () => {
      const newBound = selectedObject.getBoundingRect();
      deleteBtn.style.left = `${newBound.left + newBound.width / 2 - 12}px`;
      deleteBtn.style.top = `${newBound.top - 24}px`;
    });

    selectedObject.on("scaling", () => {
      const newBound = selectedObject.getBoundingRect();
      deleteBtn.style.left = `${newBound.left + newBound.width / 2 - 12}px`;
      deleteBtn.style.top = `${newBound.top - 24}px`;
    });
  };

  // 모바일 삭제 버튼 제거 함수
  const removeMobileDeleteButton = () => {
    const deleteBtn = wrapperRef.current?.querySelector(".mobile-delete-btn");
    if (deleteBtn) {
      deleteBtn.remove();
    }
  };

  // 객체가 캔버스 밖으로 나가지 않도록 제한
  const handleObjectMoving = (e: any) => {
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
  };

  // 키보드 이벤트 처리
  const handleKeyDown = async (e: KeyboardEvent) => {
    if (!fabricRef.current) return;

    const activeObject = fabricRef.current.getActiveObject();
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
        objects.forEach((obj) => fabricRef.current?.remove(obj));
      } else {
        // 단일 객체 삭제
        fabricRef.current.remove(activeObject);
      }
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
      return;
    }

    // 화살표 키로 위치 미세 조정
    const MOVE_STEP = e.shiftKey ? 10 : 1;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        activeObject.set("left", activeObject.left! - MOVE_STEP);
        fabricRef.current.renderAll();
        break;
      case "ArrowRight":
        e.preventDefault();
        activeObject.set("left", activeObject.left! + MOVE_STEP);
        fabricRef.current.renderAll();
        break;
      case "ArrowUp":
        e.preventDefault();
        activeObject.set("top", activeObject.top! - MOVE_STEP);
        fabricRef.current.renderAll();
        break;
      case "ArrowDown":
        e.preventDefault();
        activeObject.set("top", activeObject.top! + MOVE_STEP);
        fabricRef.current.renderAll();
        break;
    }

    // Copy & Paste
    if ((e.ctrlKey || e.metaKey) && e.key === "c") {
      const cloned = await activeObject.clone();
      fabricRef.current.clipboard = cloned;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      if (!fabricRef.current.clipboard) return;

      const cloned = await fabricRef.current.clipboard.clone();
      fabricRef.current.discardActiveObject();
      cloned.set({
        left: cloned.left + 10,
        top: cloned.top + 10,
        evented: true,
      });
      fabricRef.current.add(cloned);
      fabricRef.current.setActiveObject(cloned);
      fabricRef.current.renderAll();
    }
  };

  // 우클릭 메뉴
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    const target = fabricRef.current?.findTarget(e);

    if (target) {
      fabricRef.current?.setActiveObject(target);
      fabricRef.current?.renderAll();
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
  useEffect(() => {
    if (!wrapperRef.current) return;

    wrapperRef.current.addEventListener("keydown", handleKeyDown);
    wrapperRef.current.tabIndex = 0;
    if (canvasRef.current) {
      canvasRef.current.addEventListener("contextmenu", handleContextMenu);
    }

    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("keydown", handleKeyDown);
      }
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, []);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.on("object:moving", handleObjectMoving);
    }

    return () => {
      if (fabricRef.current) {
        fabricRef.current.off("object:moving", handleObjectMoving);
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
        className="relative flex-1 flex items-center justify-center overflow-hidden bg-gray-100"
        tabIndex={-1}
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            className=""
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
            }}
          />
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
