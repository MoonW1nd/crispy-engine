const { expect, assert } = require('chai');
const sinon = require('sinon');
const { Dispatcher, Actions, Store } = require('./../index.js');

describe('Actions', () => {
  it('корректно создаются actionCreators', () => {
    const dispatcher = new Dispatcher();
    const actions = new Actions(dispatcher);
    const store = Store.createStore({}, dispatcher);
    const addItemMock = sinon.fake();
    const removeItemMock = sinon.fake();

    actions.create('ADD_ITEM');
    actions.create('REMOVE_ITEM');

    store.registerActions((payload) => {
      switch (payload.action) {
        case actions.list.ADD_ITEM:
          addItemMock(payload.data);
          break;

        case actions.list.REMOVE_ITEM:
          removeItemMock(payload.data);
          break;

        default:
      }
    });

    actions.addItem({ index: 'id_1' });
    actions.removeItem({ index: 'id_2' });

    expect(actions.list).to.deep.equal({
      ADD_ITEM: 'ADD_ITEM',
      REMOVE_ITEM: 'REMOVE_ITEM',
    });
    expect(actions.creatorsList).to.deep.equal({
      addItem: 'ADD_ITEM',
      removeItem: 'REMOVE_ITEM',
    });
    assert(addItemMock.calledOnceWith({ index: 'id_1' }), 'не корректно работает функция actionCreator(добавления элемента)');
    assert(removeItemMock.calledOnceWith({ index: 'id_2' }), 'не корректно работает функция actionCreator(удаление элемента)');
  });
});
