/* global document window */

function renderCard(parent, cardData) {
  const template = document.getElementsByClassName('CardTemplate')[0];
  const templateContent = template.content;
  const articleElements = {};

  articleElements.main = templateContent.querySelector('.Article');
  articleElements.icon = templateContent.querySelector('.Title-Icon');
  articleElements.title = templateContent.querySelector('.Title-Content');
  articleElements.source = templateContent.querySelector('.Article-Source');
  articleElements.time = templateContent.querySelector('.Article-Time');
  articleElements.description = templateContent.querySelector('.Article-Description');
  articleElements.data = templateContent.querySelector('.Article-Data');

  Object.keys(cardData).forEach((key) => {
    switch (key) {
      case 'type':
        articleElements.main.classList.add(`Article_type_${cardData[key]}`);
        break;

      case 'size':
        articleElements.main.classList.add(`Article_size_${cardData[key]}`);
        break;

      default:
        articleElements[key].textContent = cardData[key];
    }
  });

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}

const data = require('./data/events.json');

window.onload = () => {
  const parent = document.querySelector('.MainContent-ContentHolder');

  data.events.forEach((eventData) => {
    renderCard(parent, eventData);
  });
};
