/* global document window */
import { render } from './blocks/Card/Card';
import swipeEvent from './blocks/_helpers/_events';


const data = require('./data/events.json');

window.onload = () => {
  const parent = document.querySelector('.PageContent-ContentGrid');

  data.events.forEach((eventData) => {
    render(parent, eventData);
  });

  const element = parent.querySelector('.Article-Data_type_image img');

  swipeEvent(element);
};
