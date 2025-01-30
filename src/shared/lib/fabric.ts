import {
  Canvas as FabricCanvas,
  IText as FabricIText,
  loadSVGFromString,
  FabricImage,
  util,
  FabricObject,
  Group,
  Circle,
} from "fabric";

export class Canvas extends FabricCanvas {
  clipboard: any;

  constructor(element: HTMLCanvasElement, options?: any) {
    super(element, options);
    this.clipboard = null;
  }
}

export class IText extends FabricIText {
  constructor(text: string, options?: any) {
    super(text, {
      ...options,
      editable: true,
      fontFamily: "Arial",
    });

    // 텍스트 선택 시 기본 컨트롤 숨기기
    this.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: true,
      br: true,
      tl: true,
      tr: true,
      mtr: true,
    });

    // 편집 모드 이벤트 처리
    this.on("editing:entered", () => {
      this.isEditing = true;
    });

    this.on("editing:exited", () => {
      this.isEditing = false;
    });
  }
}

export { FabricImage, loadSVGFromString, util, FabricObject, Group, Circle };
