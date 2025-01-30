import { create } from "zustand";
import { Canvas, FabricObject } from "@/shared/lib/fabric";

interface CanvasState {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas) => void;
  activeObject: FabricObject | null;
  setActiveObject: (object: FabricObject | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  activeObject: null,
  setActiveObject: (object) => set({ activeObject: object }),
}));
