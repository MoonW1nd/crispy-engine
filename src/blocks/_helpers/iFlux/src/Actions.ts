import { Dispatcher } from './Dispatcher';

interface IActionsList {
  [id: string]: string;
}

export class Actions {
  [id: string]: any;
  public dispatcher: Dispatcher;
  public list: IActionsList;
  public creatorsList: IActionsList;

  constructor(dispatcher: Dispatcher) {
    this.dispatcher = dispatcher;
    this.list = {};
    this.creatorsList = {};
  }

  public create(actionName: string, actionCreatorName: string | null | undefined) {
    if (actionCreatorName == null) { actionCreatorName = convertUpperCaseToCamelCase(actionName); }
    if (actionName in this.list) { throw Error('Имя заданного действия уже существует'); }
    if (actionCreatorName in this.creatorsList) { throw Error('Имя метода создания события уже существует'); }

    this.list[actionName] = actionName;
    this.creatorsList[actionCreatorName] = actionName;

    Actions.prototype[actionCreatorName] = (data: any) => {
      this.dispatcher.dispatch({
        action: this.list[actionName],
        data,
      });
    };
  }
}

function convertUpperCaseToCamelCase(value: string) {
  value = value.toLowerCase();
  return value.replace(/_\w/g, (m) => m[1].toUpperCase() );
}
