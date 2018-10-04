/* global document window */
import Card from './blocks/Card/Card';

const data = require('./data/events.json');

window.onload = () => {
  const parent = document.querySelector('.PageContent-ContentGrid');

  data.events.forEach((eventData) => {
    Card.render(parent, eventData);
  });
};
