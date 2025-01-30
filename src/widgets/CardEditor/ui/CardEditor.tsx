'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@/shared/lib/fabric';
import { useCanvasStore } from '@/entities/canvas/model/store';

export const CardEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { setCanvas } = useCanvasStore();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize fabric canvas
    const canvas = new Canvas(canvasRef.current, {
      width: 900,
      height: 500,
      backgroundColor: '#ffffff',
    });

    fabricRef.current = canvas;
    setCanvas(canvas);

    // Enable object movement
    canvas.on('object:moving', (e) => {
      const obj = e.target;
      if (!obj) return;

      // Keep objects within canvas bounds
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

    // Handle zoom gestures
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY;
        setZoom(prev => {
          const newZoom = prev + (delta > 0 ? -0.1 : 0.1);
          return Math.min(Math.max(0.1, newZoom), 3);
        });
      }
    };

    canvasRef.current.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
      canvas.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [setCanvas]);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setZoom(zoom);
      fabricRef.current.renderAll();
    }
  }, [zoom]);

  return (
    <div className="w-full h-full overflow-auto bg-white">
      <div className="min-h-full p-8 flex items-center justify-center">
        <div 
          className="border border-gray-200 rounded shadow-lg"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};
