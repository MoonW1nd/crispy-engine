/* global document */
import { getTemplateContent } from '../_helpers/_helpers';

export default function renderThermalWidget(parent, data) {
  const templateContent = getTemplateContent('ThermalWidgetTemplate');

  templateContent.querySelector('.ThermalWidget-TemperatureValue').innerHTML = data.temperature;
  templateContent.querySelector('.ThermalWidget-HumidityValue').innerHTML = data.humidity;

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}
