/* global document */
function getImageHtml(nameImage, extension, className, alt = null) {
  return `<img src="./assets/${nameImage}.${extension}" class="${className}" alt="${alt != null ? alt : nameImage}"/>`;
}


function setDataWidget(dataElement, data) {
  const element = dataElement;

  if (data.type === 'graph') {
    element.classList.add('Article-Data_type_graph');
    element.innerHTML = getImageHtml('richdata', 'svg', 'DataImage', 'График');
  } else if ('image' in data) {
    element.classList.add('Article-Data_type_image');

    const imageDate = data.image.split('.');
    const imageName = imageDate[0];
    const imageExtension = imageDate[1];

    element.innerHTML = getImageHtml(imageName, imageExtension, 'DataImage');
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
  const template = document.getElementsByClassName('CardTemplate')[0];
  const templateContent = document.importNode(template.content, true);
  const articleElements = getArticleElements();

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
    if (!articleElements[element].innerHTML) {
      articleElements[element].parentNode.removeChild(articleElements[element]);
    }
  });

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}

const Card = {
  render,
};

export default Card;
