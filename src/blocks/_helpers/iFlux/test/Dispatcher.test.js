const { expect, assert } = require('chai');
const sinon = require('sinon');
const { Dispatcher } = require('../index');

describe('Dispatcher', () => {
  it('Корректно регистрируются функции обратного вызова Store', () => {
    const dispatcher = new Dispatcher();
    const storeCallback = () => {};

    const callbackId = dispatcher.register(storeCallback);

    expect(dispatcher.callbacks[callbackId]).to.be.equal(storeCallback);
  });

  it('метод dispatch вызывает зарегистрированные функции обратного вызова Store', () => {
    const dispatcher = new Dispatcher();
    const storeCallback = sinon.fake();
    const action = {
      action: 'ADD_ITEM',
      item: 'test',
    };

    dispatcher.register(storeCallback);
    dispatcher.dispatch(action);

    assert(storeCallback.calledOnce, 'функция обратного вызова не была вызвана');
    assert(storeCallback.calledWith(action), 'функция обратного вызова была вызвана с некорректными данными');
  });

  it('Корректно удаляются функции обратного вызова Store', () => {
    const dispatcher = new Dispatcher();
    const storeCallback = sinon.fake();
    const action = {
      action: 'ADD_ITEM',
      item: 'test',
    };

    const callbackId = dispatcher.register(storeCallback);
    dispatcher.unregister(callbackId);
    dispatcher.dispatch(action);

    assert(storeCallback.notCalled, 'функция обратного вызова была вызвана при использовании метода dispatch');
    expect(callbackId in dispatcher.callbacks, 'поле с id функции обратного вызова не было удалено').to.be.false;
  });
});
