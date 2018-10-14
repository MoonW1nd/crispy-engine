/* global isNaN document */
import { getTemplateContent } from '../_helpers/_helpers';

export default class RangeController {
  constructor(options) {
    this.parent = options.parent;
    this.type = options.type ? options.type : 'sun';
    this.modifier = options.modifier;
    this.visible = options.visible;
    this.rangeMin = options.rangeMin || 0;
    this.rangeMax = options.rangeMax || 100;

    this.id = typeof RangeController.id === 'number' && !Number.isNaN(RangeController.id)
      ? RangeController.id + 1
      : 0;

    RangeController.id = this.id;

    if (this.parent != null) this.render();
  }

  render(parent = this.parent) {
    if (parent == null) {
      throw Error('Следует указать элемент куда следует поместить контроллер');
    }

    const templateContent = getTemplateContent('RangeControllerTemplate');
    const templateController = templateContent.querySelector('.RangeController');
    templateController.classList.add(`RangeController_type_${this.type}`);
    templateController.classList.add(`RangeController_id_${this.id}`);

    if (!this.visible) {
      templateController.classList.add('RangeController_hidden');
    }

    if (this.modifier) {
      templateController.classList.add(this.modifier);
    }
    const clone = document.importNode(templateContent, true);


    parent.appendChild(clone);
    this.view = parent.querySelector(`.RangeController_id_${this.id}`);
    this.dom = {
      input: this.view.querySelector('.RangeController-Scale'),
    };

    this.dom.input.setAttribute('min', this.rangeMin);
    this.dom.input.setAttribute('max', this.rangeMax);
  }

  show() {
    this.view.classList.remove('RangeController_hidden');
  }

  hide() {
    this.view.classList.add('RangeController_hidden');
  }
}
