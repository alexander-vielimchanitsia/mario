
enum KeyState {
  RELEASED,
  PRESSED,
}

export class Keyboard {
  keyStates: Map<string, KeyState>;
  keyMap: Map<string, (keyState: number) => void>;

  constructor() {
    // Holds the current state of a given key
    this.keyStates = new Map();

    // Holds the callback functions for a key code
    this.keyMap = new Map();
  }

  addMapping(code: string, callback: (keyState: number) => void) {
    this.keyMap.set(code, callback);
  }

  handleEvent(event: KeyboardEvent) {
    const {code} = event;

    if (!this.keyMap.has(code)) {
      // Did not have key mapped.
      return;
    }

    event.preventDefault();

    const keyState = event.type === 'keydown' ? KeyState.PRESSED : KeyState.RELEASED;

    if (this.keyStates.get(code) === keyState) {
      return;
    }

    this.keyStates.set(code, keyState);

    this.keyMap.get(code)(keyState);
  }

  listenTo(element: HTMLElement | Window) {
    ['keydown', 'keyup'].forEach(eventName => {
      element.addEventListener(eventName, (event: KeyboardEvent) => {
        this.handleEvent(event);
      });
    });
  }
}
