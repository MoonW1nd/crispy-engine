/* global document window */
declare function require(moduleNames: string[], onLoad: (...args: any[]) => void): void;

import touchEvents from './blocks/_helpers/_events';
import { getTruncateHandler } from './blocks/_helpers/_helpers';
import { render } from './blocks/Card/Card';

function isTouchDevice() {
  return Boolean('ontouchstart' in window);
}

require(['text!data/events.json'], (data) => {

  const parent = document.querySelector('.PageContent-ContentGrid');
  if (!parent) { throw Error('Родитель не найден'); }

  data = JSON.parse(data);
  if (isTouchDevice()) {
    const body = document.querySelector('body');
    if (body) { body.classList.add('touch'); }
  }

  data.events.forEach((eventData: object) => {
    render(parent, eventData);
  });

  const truncateHandlers: VoidFunction[] = [];

  Array.from(parent.querySelectorAll('.Title-Content')).forEach((title) => {
    const truncate = getTruncateHandler(title);
    truncate();
    truncateHandlers.push(truncate);
  });

  const element = parent.querySelector('.Card-Data_type_image img');
  if (!element) { throw Error('Снимок не найден'); }

  touchEvents(element.parentNode, element);

  // оптимизация resize событий
  (() => {
    function actualResizeHandler() {
      truncateHandlers.forEach((truncateHandler) => {
        truncateHandler();
      });
    }

    let resizeTimeout: number | null;
    function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          actualResizeHandler();
        }, 66);
      }
    }

    window.addEventListener('resize', resizeThrottler, false);
  })();
});
