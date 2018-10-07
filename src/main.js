/* global document window */
import { render } from './blocks/Card/Card';
import touchEvents from './blocks/_helpers/_events';
import { getTruncateHandler } from './blocks/_helpers/_helpers';


const data = require('./data/events.json');

function isTouchDevice() {
  return Boolean('ontouchstart' in window);
}

window.onload = () => {
  const parent = document.querySelector('.PageContent-ContentGrid');

  if (isTouchDevice()) {
    document.querySelector('body').classList.add('touch');
  }

  data.events.forEach((eventData) => {
    render(parent, eventData);
  });

  const truncateHandlers = [];

  Array.from(parent.querySelectorAll('.Title-Content')).forEach((title) => {
    const truncate = getTruncateHandler(title);
    truncate();
    truncateHandlers.push(truncate);
  });
  const element = parent.querySelector('.Card-Data_type_image img');

  touchEvents(element.parentNode, element);

  // оптимизация resize событий
  (function () { //eslint-disable-line
    function actualResizeHandler() {
      truncateHandlers.forEach((truncateHandler) => {
        truncateHandler();
      });
    }

    let resizeTimeout;
    function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          actualResizeHandler();
        }, 66);
      }
    }

    window.addEventListener('resize', resizeThrottler, false);
  }());
};
