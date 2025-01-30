export const CANVAS_SIZES = {
  MOBILE: {
    width: 360,
    height: 640,
    label: "모바일",
  },
  BUSINESS_CARD: {
    width: 900,
    height: 500,
    label: "명함",
  },
} as const;

export const MAX_CANVAS_SIZE = {
  width: 1200,
  height: 800,
};

export type CanvasSize = {
  width: number;
  height: number;
};

// 이벤트 타입 정의
export const CANVAS_EVENTS = {
  OPEN_SIZE_MODAL: "canvas:open-size-modal",
  RESIZE_CANVAS: "canvas:resize",
} as const;
