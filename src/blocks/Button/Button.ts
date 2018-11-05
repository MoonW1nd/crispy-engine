/* global isNaN document */
import { getTemplateContent } from 'blocks/_helpers/_helpers';

interface IButtonOptions {
  content?: string;
  parent: Element;
  visible?: boolean;
  modifier?: string;
}

export default class Button {
  public static id: number;
  public content: string;
  public parent: Element;
  public visible: boolean;
  public modifier: string;
  public id: number;
  public view: Element | null;

  constructor(options: IButtonOptions) {
    this.content = options.content ? options.content : '';
    this.parent = options.parent;
    this.visible = !!options.visible;
    this.modifier = options.modifier ? options.modifier : '';
    this.view = null;

    this.id = typeof Button.id === 'number' && !Number.isNaN(Button.id)
      ? Button.id + 1
      : 0;

    Button.id = this.id;
    if (this.parent != null) { this.render(); }
  }

  public render(parent = this.parent) {
    if (parent == null) {
      throw Error('Следует указать элемент куда следует поместить кнопку');
    }
    const templateContent = getTemplateContent('ButtonTemplate');
    const templateButton = templateContent.querySelector('.Button');

    if (templateButton) {
      templateButton.innerHTML = this.content;
    } else {
      throw Error('Не корректный шаблон: .Button не найден');
    }

    const clone = document.importNode(templateContent, true);
    const button = clone.querySelector('.Button');
    if (button) {
      button.classList.add(`Button_id_${this.id}`);

      if (!this.visible) {
        button.classList.add('Button_hidden');
      }

      if (this.modifier) {
        button.classList.add(this.modifier);
      }
    }

    parent.appendChild(clone);
    this.view = parent.querySelector(`.Button_id_${this.id}`);
  }

  public show() {
    if (this.view) {
      this.view.classList.remove('Button_hidden');
    }
  }

  public hide() {
    if (this.view) {
      this.view.classList.add('Button_hidden');
    }
  }
}
