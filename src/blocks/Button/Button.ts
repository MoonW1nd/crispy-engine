/* global isNaN document */
import { getTemplateContent } from 'blocks/_helpers/_helpers';

export default class Button {
  constructor(options) {
    this.content = options.content;
    this.parent = options.parent;
    this.visible = options.visible;
    this.modifier = options.modifier;

    this.id = typeof Button.id === 'number' && !Number.isNaN(Button.id)
      ? Button.id + 1
      : 0;

    Button.id = this.id;
    if (this.parent != null) this.render();
  }

  render(parent = this.parent) {
    if (parent == null) {
      throw Error('Следует указать элемент куда следует поместить кнопку');
    }
    const templateContent = getTemplateContent('ButtonTemplate');
    const templateButton = templateContent.querySelector('.Button');
    templateButton.innerHTML = this.content;

    const clone = document.importNode(templateContent, true);
    const button = clone.querySelector('.Button');
    button.classList.add(`Button_id_${this.id}`);

    if (!this.visible) {
      button.classList.add('Button_hidden');
    }

    if (this.modifier) {
      button.classList.add(this.modifier);
    }

    parent.appendChild(clone);
    this.view = parent.querySelector(`.Button_id_${this.id}`);
  }

  show() {
    this.view.classList.remove('Button_hidden');
  }

  hide() {
    this.view.classList.add('Button_hidden');
  }
}
