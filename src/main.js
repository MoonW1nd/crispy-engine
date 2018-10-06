/* global document window */
import { render } from './blocks/Card/Card';
import swipeEvent from './blocks/_helpers/_events';
import { getTruncateHandler } from './blocks/_helpers/_helpers';


const data = require('./data/events.json');

window.onload = () => {
  const parent = document.querySelector('.PageContent-ContentGrid');

  data.events.forEach((eventData) => {
    render(parent, eventData);
  });

  const truncateHandlers = [];

  Array.from(parent.querySelectorAll('.Title-Content')).forEach((title) => {
    const truncate = getTruncateHandler(title);
    truncate();
    truncateHandlers.push(truncate);
  });
  const element = parent.querySelector('.Article-Data_type_image img');

  swipeEvent(element);

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
