/* global document */
import { getTemplateContent } from '../_helpers/_helpers';
import { ICardDataButtons } from '../Card/Card';

export default function renderConfirmButtonsWidget(parent: Element, data: ICardDataButtons) {
  const templateContent = getTemplateContent('ConfirmButtonsWidgetTemplate');
  const buttonConfirm =  templateContent.querySelector('.WidgetButton_type_confirm');
  const buttonCancel = templateContent.querySelector('.WidgetButton_type_cancel');

  if (buttonConfirm != null && buttonCancel != null) {
    [
      buttonConfirm.innerHTML,
      buttonCancel.innerHTML,
    ] = data.buttons;
  } else {
    throw new Error('Не корректный шаблон для виджета кнопок');
  }

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}
