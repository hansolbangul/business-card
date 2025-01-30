import { create } from 'zustand';
import { fabric } from 'fabric';

interface CanvasState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  activeObject: fabric.Object | null;
  setActiveObject: (object: fabric.Object | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  activeObject: null,
  setActiveObject: (object) => set({ activeObject: object }),
}));
