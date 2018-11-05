/* global document */
import { getTemplateContent } from '../_helpers/_helpers';
import { ICardDataWeather } from '../Card/Card';

export default function renderThermalWidget(parent: HTMLElement, data: ICardDataWeather) {
  const templateContent = getTemplateContent('ThermalWidgetTemplate');
  const temperatureElement = templateContent.querySelector('.ThermalWidget-TemperatureValue');
  const humidityElement = templateContent.querySelector('.ThermalWidget-HumidityValue');

  if (temperatureElement && humidityElement) {
    temperatureElement.innerHTML = String(data.temperature);
    humidityElement.innerHTML = String(data.humidity);
  } else {
    throw Error('Не корректный шаблон');
  }

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}
