/* global document */
import { getImageHtml, getTemplateContent } from '../_helpers/_helpers';
import renderConfirmButtonsWidget from '../ConfirmButtonsWidget/ConfirmButtonsWidget';
import renderThermalWidget from '../ThermalWidget/ThermalWidget';
import renderMusicWidget from '../MusicWidget/MusicWidget';

function setDataWidget(dataElement, data) {
  const element = dataElement;
  const isGraphWidget = data.type === 'graph';
  const isImageWidget = 'image' in data && typeof data.image === 'string';
  const isThermalWidget = 'temperature' in data && 'humidity' in data;
  const isConfirmButtonsWidget = 'buttons' in data && Array.isArray(data.buttons);
  const isMusicWidget = 'albumcover' in data
    && 'artist' in data
    && 'track' in data
    && 'volume' in data;

  switch (true) {
    case isGraphWidget: {
      element.classList.add('Card-Data_type_graph');
      element.innerHTML = getImageHtml('richdata', 'svg', 'DataImage', 'График');
      break;
    }

    case isImageWidget: {
      const imageDate = data.image.split('.');
      const imageName = imageDate[0];
      const imageExtension = imageDate[1];
      element.innerHTML = `
        <div class="Card-DataImageWrapper Card-Data_type_image">
          ${getImageHtml(imageName, imageExtension, 'DataImage')}
        </div>
        <div class="DataInfo Card-DataInfoWrapper">
          <div class="DataInfo-Zoom">Приближение: <span class="DataInfo-ZoomValue">0</span>%</div>
          <div class="DataInfo-Light">Яркость: <span class="DataInfo-LightValue">10</span>%</div>
        </div>
      `;
      break;
    }

    case isThermalWidget: {
      renderThermalWidget(element, data);
      break;
    }

    case isConfirmButtonsWidget: {
      renderConfirmButtonsWidget(element, data);
      break;
    }

    case isMusicWidget: {
      renderMusicWidget(element, data);
      break;
    }

    default:
      // throw Error('Не удалось определить тип виджета.');
  }
}


function getCardElements(templateContent) {
  const elements = {};

  elements.main = templateContent.querySelector('.Card');
  elements.closeButton = templateContent.querySelector('.Card-CloseButton');
  elements.nextButton = templateContent.querySelector('.Card-NextButton');
  elements.icon = templateContent.querySelector('.Title-IconWrapper');
  elements.title = templateContent.querySelector('.Title-Content');
  elements.source = templateContent.querySelector('.Card-Source');
  elements.time = templateContent.querySelector('.Card-Time');
  elements.description = templateContent.querySelector('.Card-Description');
  elements.data = templateContent.querySelector('.Card-Data');

  return elements;
}


export function render(parent, cardData) {
  const templateContent = getTemplateContent('CardTemplate');
  const cardElements = getCardElements(templateContent);

  Object.keys(cardData).forEach((key) => {
    switch (key) {
      case 'type':
        cardElements.main.classList.add(`Card_type_${cardData[key]}`);
        break;

      case 'size':
        cardElements.main.classList.add(`Card_size_${cardData[key]}`);
        break;

      case 'icon':
        if (cardData.type === 'info') {
          cardElements[key].innerHTML = getImageHtml(cardData[key], 'svg', 'Title-Icon');
          cardElements.closeButton.innerHTML = getImageHtml('cross', 'svg', 'Card-CrossIcon', 'Закрыть');
        } else if (cardData.type === 'critical') {
          cardElements[key].innerHTML = getImageHtml(`${cardData[key]}-white`, 'svg', 'Title-Icon');
          cardElements.closeButton.innerHTML = getImageHtml('cross-white', 'svg', 'Card-CrossIcon', 'Закрыть');
        } else {
          throw Error('Data Error: не корректный тип события.');
        }

        cardElements.nextButton.innerHTML = getImageHtml('arrow', 'svg', 'Card-NextIcon', 'Дальше');
        break;

      default:
        if (key !== 'data' && Object(cardData[key]) !== cardData[key]) {
          cardElements[key].textContent = cardData[key];
        } else if (key === 'data') {
          setDataWidget(cardElements.data, cardData.data);
        } else {
          throw Error('Data error: Не корректный формат данных.');
        }
    }
  });

  Object.keys(cardElements).forEach((element) => {
    if (!cardElements[element].innerHTML.trim()) {
      cardElements[element].parentNode.removeChild(cardElements[element]);
    }
  });

  const contentWrapper = templateContent.querySelector('.Card-Content');
  if (!contentWrapper.innerHTML.trim()) {
    contentWrapper.parentNode.removeChild(contentWrapper);
  }

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}

const Card = {
  render,
};

export default Card;
