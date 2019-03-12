
enum KeyState {
  RELEASED,
  PRESSED,
}

export class Keyboard {
  keyStates: Map<string, KeyState>;
  keyHandlers: Map<string, (keyState: number) => void>;

  constructor() {
    this.keyStates = new Map();
    this.keyHandlers = new Map();
  }

  addMapping(code: string, callback: (keyState: number) => void) {
    this.keyHandlers.set(code, callback);
  }

  handleEvent(event: KeyboardEvent) {
    const {code} = event;

    if (!this.keyHandlers.has(code))
      return;

    event.preventDefault();

    const keyState = event.type === 'keydown' ? KeyState.PRESSED : KeyState.RELEASED;

    if (this.keyStates.get(code) === keyState)
      return;

    this.keyStates.set(code, keyState);
    this.keyHandlers.get(code)(keyState);
  }

  listenTo(element: HTMLElement | Window) {
    ['keydown', 'keyup'].forEach(eventName => {
      element.addEventListener(eventName, (event: KeyboardEvent) => {
        this.handleEvent(event);
      });
    });
  }
}
