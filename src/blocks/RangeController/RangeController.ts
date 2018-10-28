/* global isNaN document */
import { getTemplateContent } from '../_helpers/_helpers';

interface IRangeControllerDOM {
  input: Element | null;
}

interface IRangeControllerOptions {
  parent: HTMLElement;
  type?: string;
  modifier?: string;
  visible?: boolean;
  rangeMin?: number;
  rangeMax?: number;
}

export default class RangeController {
  public static id: number;
  public parent: Element;
  public visible: boolean;
  public modifier: string;
  public id: number;
  public view: Element | null;
  public type: string;
  public rangeMin: number;
  public rangeMax: number;
  public dom: IRangeControllerDOM;

  constructor(options: IRangeControllerOptions) {
    this.parent = options.parent;
    this.type = options.type ? options.type : 'sun';
    this.modifier = options.modifier ? options.modifier : '';
    this.visible = !!options.visible;
    this.rangeMin = options.rangeMin || 0;
    this.rangeMax = options.rangeMax || 100;
    this.view = null;
    this.dom = {
      input: null,
    };

    this.id = typeof RangeController.id === 'number' && !Number.isNaN(RangeController.id)
      ? RangeController.id + 1
      : 0;

    RangeController.id = this.id;

    if (this.parent != null) { this.render(); }
  }

  public render(parent = this.parent) {
    if (parent == null) {
      throw Error('Следует указать элемент куда следует поместить контроллер');
    }

    const templateContent = getTemplateContent('RangeControllerTemplate');
    const templateController = templateContent.querySelector('.RangeController');

    if (templateController) {
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
    } else {
      throw new Error('Некорректный шаблон');
    }

    this.view = parent.querySelector(`.RangeController_id_${this.id}`);

    if (this.view) {
      this.dom = {
        input: this.view.querySelector('.RangeController-Scale'),
      };
    }

    if (this.dom.input) {
      this.dom.input.setAttribute('min', String(this.rangeMin));
      this.dom.input.setAttribute('max', String(this.rangeMax));

    }
  }

  public show() {
    if (this.view) {
      this.view.classList.remove('RangeController_hidden');
    }
  }

  public hide() {
    if (this.view) {
      this.view.classList.add('RangeController_hidden');
    }
  }
}
