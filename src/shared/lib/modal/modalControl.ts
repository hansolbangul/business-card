import { ModalContentFn, ModalEvent } from "./types";

class ModalControl {
  private subscribers: ((event: ModalEvent) => void)[] = [];

  subscribe(callback: (event: ModalEvent) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private publish(event: ModalEvent) {
    this.subscribers.forEach((callback) => callback(event));
  }

  open(content: ModalContentFn) {
    this.publish({
      type: "OPEN_MODAL",
      payload: { content },
    });
  }

  close() {
    this.publish({
      type: "CLOSE_MODAL",
    });
  }
}

export const modalControl = new ModalControl();
