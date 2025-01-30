import { ReactNode } from "react";

export type CloseModalFn = () => void;
export type ModalContentFn = (close: CloseModalFn) => ReactNode;

export interface ModalEvent {
  type: "OPEN_MODAL" | "CLOSE_MODAL";
  payload?: {
    content?: ModalContentFn;
  };
}
