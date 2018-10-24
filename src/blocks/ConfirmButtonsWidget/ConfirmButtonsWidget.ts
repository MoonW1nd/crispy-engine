/* global document */
import { getTemplateContent } from '../_helpers/_helpers';

export default function renderConfirmButtonsWidget(parent, data) {
  const templateContent = getTemplateContent('ConfirmButtonsWidgetTemplate');
  [
    templateContent.querySelector('.WidgetButton_type_confirm').innerHTML,
    templateContent.querySelector('.WidgetButton_type_cancel').innerHTML,
  ] = data.buttons;

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}
