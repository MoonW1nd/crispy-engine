import { Dispatcher, ICallbackStore, IPayload } from './Dispatcher';

function _copy(from: any, to: any = {}) {
  for (const key of Object.keys(from)) {
    if (Object(from[key]) === from[key] && from[key].constructor === Object) {
      _copy(from[key], to[key] != null ? to[key] : to[key] = {});
    } else {
      to[key] = from[key];
    }
  }
}

function _extend(...objects: any): any {
    const result = {};

    for (const object of objects) {
      _copy(object, result);
    }

    return result;
}

function createStore(store: any, dispatcher: Dispatcher) {

  let STORE = _extend(store);

  class FluxStore {
    public actionsId: string;
    public dispatcher: Dispatcher;
    public callbacks: Array<() => void>;

    constructor() {
      this.actionsId = '';
      this.dispatcher = dispatcher;
      this.callbacks = [];
    }

    public registerActions(actionsHandlers: (payload: IPayload) => {}): void {
      const resultFunction = (payload: IPayload) => {
        actionsHandlers(payload);

        this.emitChange();
      };

      this.actionsId = this.dispatcher.register(resultFunction);
    }

    public unregisterActions(): void {
      this.dispatcher.unregister(this.actionsId);
    }

    public emitChange(): void {
      this.callbacks.forEach((callback) => callback());
    }

    public addListener(callback: () => void) {
      this.callbacks.push(callback);
    }

    public removeListener(callback: () => void) {
      this.callbacks.forEach((registeredCallback, index) => {
        if (callback === registeredCallback) {
          this.callbacks.splice(index, 1);
        }
      });
    }

    public getStore() {
      return _extend(STORE);
    }

    public updateStore(value: any) {
      STORE = _extend(STORE, value);
    }
  }

  return new FluxStore();
}

export default {
  createStore,
};
export const Store = { createStore };
