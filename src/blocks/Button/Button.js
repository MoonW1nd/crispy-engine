/* global isNaN document */
import { getTemplateContent } from '../_helpers/_helpers';

export default class Button {
  constructor(options) {
    this.content = options.content;
    this.parent = options.parent;
    this.visible = options.visible;
    this.modifier = options.modifier;

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

    if (!this.visible) {
      clone.querySelector('.Button').classList.add('Button_hidden');
    }

    if (this.modifier) {
      clone.querySelector('.Button').classList.add(this.modifier);
    }

    parent.appendChild(clone);
    this.view = parent.querySelector('.Button');
  }

  show() {
    this.view.classList.remove('Button_hidden');
  }

  hide() {
    this.view.classList.add('Button_hidden');
  }
}
