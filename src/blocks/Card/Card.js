/* global document */
function getImageHtml(nameImage, extension, className, alt = null) {
  return `<img src="./assets/${nameImage}.${extension}" class="${className}" alt="${alt != null ? alt : nameImage}"/>`;
}


function getTemplateContent(templateClassName) {
  const template = document.getElementsByClassName(templateClassName)[0];
  return document.importNode(template.content, true);
}

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
      element.classList.add('Article-Data_type_graph');
      element.innerHTML = getImageHtml('richdata', 'svg', 'DataImage', 'График');
      break;
    }

    case isImageWidget: {
      element.classList.add('Article-Data_type_image');
      const imageDate = data.image.split('.');
      const imageName = imageDate[0];
      const imageExtension = imageDate[1];
      element.innerHTML = getImageHtml(imageName, imageExtension, 'DataImage');
      break;
    }

    case isThermalWidget: {
      const templateContent = getTemplateContent('ThermalWidgetTemplate');

      templateContent.querySelector('.ThermalWidget-TemperatureValue').innerHTML = data.temperature;
      templateContent.querySelector('.ThermalWidget-HumidityValue').innerHTML = data.humidity;

      const clone = document.importNode(templateContent, true);
      element.appendChild(clone);
      break;
    }

    case isConfirmButtonsWidget: {
      const templateContent = getTemplateContent('ConfirmButtonsWidgetTemplate');
      [
        templateContent.querySelector('.WidgetButton_type_confirm').innerHTML,
        templateContent.querySelector('.WidgetButton_type_cancel').innerHTML,
      ] = data.buttons;

      const clone = document.importNode(templateContent, true);
      element.appendChild(clone);
      break;
    }

    case isMusicWidget: {
      const templateContent = getTemplateContent('MusicWidgetTemplate');

      const clone = document.importNode(templateContent, true);
      element.appendChild(clone);
      break;
    }

    default:
      // throw Error('Не удалось определить тип виджета.');
  }
}


function getArticleElements(templateContent) {
  const elements = {};

  elements.main = templateContent.querySelector('.Article');
  elements.closeButton = templateContent.querySelector('.Article-CloseButton');
  elements.nextButton = templateContent.querySelector('.Article-NextButton');
  elements.icon = templateContent.querySelector('.Title-IconWrapper');
  elements.title = templateContent.querySelector('.Title-Content');
  elements.source = templateContent.querySelector('.Article-Source');
  elements.time = templateContent.querySelector('.Article-Time');
  elements.description = templateContent.querySelector('.Article-Description');
  elements.data = templateContent.querySelector('.Article-Data');

  return elements;
}


function render(parent, cardData) {
  const templateContent = getTemplateContent('CardTemplate');
  const articleElements = getArticleElements(templateContent);

  Object.keys(cardData).forEach((key) => {
    switch (key) {
      case 'type':
        articleElements.main.classList.add(`Article_type_${cardData[key]}`);
        break;

      case 'size':
        articleElements.main.classList.add(`Article_size_${cardData[key]}`);
        break;

      case 'icon':
        if (cardData.type === 'info') {
          articleElements[key].innerHTML = getImageHtml(cardData[key], 'svg', 'Title-Icon');
          articleElements.closeButton.innerHTML = getImageHtml('cross', 'svg', 'Article-CrossIcon', 'Закрыть');
        } else if (cardData.type === 'critical') {
          articleElements[key].innerHTML = getImageHtml(`${cardData[key]}-white`, 'svg', 'Title-Icon');
          articleElements.closeButton.innerHTML = getImageHtml('cross-white', 'svg', 'Article-CrossIcon', 'Закрыть');
        } else {
          throw Error('Data Error: не корректный тип события.');
        }

        articleElements.nextButton.innerHTML = getImageHtml('arrow', 'svg', 'Article-NextIcon', 'Дальше');
        break;

      default:
        if (key !== 'data' && Object(cardData[key]) !== cardData[key]) {
          articleElements[key].textContent = cardData[key];
        } else if (key === 'data') {
          setDataWidget(articleElements.data, cardData.data);
        } else {
          throw Error('Data error: Не корректный формат данных.');
        }
    }
  });

  Object.keys(articleElements).forEach((element) => {
    if (!articleElements[element].innerHTML.trim()) {
      articleElements[element].parentNode.removeChild(articleElements[element]);
    }
  });

  const contentWrapper = templateContent.querySelector('.Article-Content');
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
