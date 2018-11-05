export interface ICallbackStore {
  [id: string]: (payload: IPayload) => void;
}

export interface IPayload {
  action: string;
  data: any;
}

const idPrefix = 'id_';

export class Dispatcher {
  private id: number;
  private callbacks: ICallbackStore;

  constructor() {
    this.id = 0;
    this.callbacks = {};
  }

  public dispatch(payload: IPayload) {
    Object.keys(this.callbacks).forEach((id) => {
      this.callbacks[id](payload);
    });
  }

  public register(cb: (payload: IPayload) => void): string {
    if (typeof cb === 'function') {
      const currentId = `${idPrefix}${this.id}`;
      this.id += 1;
      this.callbacks[currentId] = cb;
      return currentId;
    } else {
      throw Error('Переданный в диспетчер cb не является функцией.');
    }
  }

  public unregister(id: string): void {
    if (this.callbacks[id]) {
      delete this.callbacks[id];
    } else {
      throw Error('Не найден cb по заданному идентификатору.');
    }
  }
}
