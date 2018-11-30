const { expect, assert } = require('chai');
const sinon = require('sinon');
const { Dispatcher, Store } = require('../index');

describe('Store:', () => {
  it('корректно добавляются подписчики', () => {
    const dispatcher = new Dispatcher();
    const store = Store.createStore({}, dispatcher);
    const viewRenderHandler = sinon.fake();

    store.addListener(viewRenderHandler);

    expect(
      store.callbacks.includes(viewRenderHandler),
      'функция обработчик подписчика не найдена',
    ).to.be.true;
  });


  it('корректно удаляются подписчики', () => {
    const dispatcher = new Dispatcher();
    const store = Store.createStore({}, dispatcher);
    const viewRenderHandler = sinon.fake();

    store.addListener(() => {});
    store.addListener(viewRenderHandler);
    store.addListener(() => {});
    store.removeListener(viewRenderHandler);

    expect(
      store.callbacks.includes(viewRenderHandler),
      'функция обработчик подписчика не удалена',
    ).to.be.false;

    expect(
      store.callbacks.length,
      'массив после удаления обработчика имеет некорректный размер',
    ).to.be.equal(2);
  });


  it('корректно отрабатывает оповещение об изменении Store', () => {
    const dispatcher = new Dispatcher();
    const store = Store.createStore({}, dispatcher);
    const firstHandlerStub = sinon.fake();
    const secondHandlerStub = sinon.fake();

    store.addListener(firstHandlerStub);
    store.addListener(secondHandlerStub);
    store.emitChange();

    assert(firstHandlerStub.calledOnce, 'функция(1) обратного вызова не была вызвана');
    assert(secondHandlerStub.calledOnce, 'функция(2) обратного вызова не была вызвана');
  });


  it('обработчики actions Store регистрируются в Dispatcher', () => {
    const dispatcher = new Dispatcher();
    const store = Store.createStore({}, dispatcher);
    const actionsHandlers = sinon.fake();
    const action = {
      action: 'ADD_ITEM',
      data: 'test',
    };

    store.registerActions(actionsHandlers);
    dispatcher.dispatch(action);

    assert(actionsHandlers.calledWith(action));
  });


  it('Store сообщает подписчикам об изменении при вызове Dispatcher.dispatch', () => {
    const dispatcher = new Dispatcher();
    const store = Store.createStore({}, dispatcher);
    const viewHandlerStub = sinon.fake();
    const action = {
      action: 'ADD_ITEM',
      data: 'test',
    };

    store.registerActions(() => {});
    store.addListener(viewHandlerStub);
    dispatcher.dispatch(action);

    assert(viewHandlerStub.calledOnce, 'функция обратного вызова не была вызвана');
  });


  it('можно получить иммутабильный Store', () => {
    const dispatcher = new Dispatcher();
    const initialStore = {
      isWorking: true,
      text: 'test',
    };
    const store = Store.createStore(initialStore, dispatcher);

    const currentStore = store.getStore();
    currentStore.isWorking = false;

    expect(store.getStore()).to.deep.include({
      isWorking: true,
      text: 'test',
    });
  });


  it('можно обновить иммутабильный Store', () => {
    const dispatcher = new Dispatcher();
    const initialStore = {
      isWorking: true,
      text: 'test',
    };
    const store = Store.createStore(initialStore, dispatcher);

    store.updateStore({
      isWorking: false,
    });

    expect(store.getStore()).to.deep.include({
      isWorking: false,
      text: 'test',
    });
  });
});
