interface IPointerInfo {
  pointerId: number;
  prevX: number;
  prevY: number;
  x: number;
  y: number;
}

interface ICurrentGesture {
  prevDiameter: number;
  prevRotate: number;
  currentPositionX: number;
  currentScale: number;
  currentRotate: number;
}

export default function touchEvents(parentNode: HTMLElement, domNode: HTMLElement) {
  const element = domNode;
  const parent = parentNode.parentElement;
  if (!parent) { throw Error('Not find parent node')}
  const zoomValueElement = parent.querySelector('.DataInfo-ZoomValue');
  const lightValueElement = parent.querySelector('.DataInfo-LightValue');
  let lightValue = 1;
  let currentGesture: ICurrentGesture | null = null;
  let pointers: IPointerInfo[] = [];


  // Парсит значение css свойства transform и возвращает нужное значение
  function getTransformValue(valueName: string) {
    const transformValue = element.style.transform;
    let value: number | null = null;

    if (transformValue) {
      transformValue.split(' ').forEach((rule) => {
        const regexp = new RegExp(valueName);

        if (regexp.test(rule)) {
          const searchResult = /[-,0-9,.]+/.exec(rule);
          value = parseFloat(String(searchResult));
        }
      });
    }

    return value;
  }


  parent.addEventListener('pointerdown', (event) => {
    element.setPointerCapture(event.pointerId);
    parent.style.transition = 'none';
    parent.style.userSelect = 'none';
    parent.style.touchAction = 'none';

    if (element.style.left) {
      currentGesture = {
        prevDiameter: 0,
        prevRotate: 0,
        currentPositionX: parseInt(String(/[-,0-9]+/.exec(element.style.left)), 10) || 0,
        currentScale: getTransformValue('scale') || 1,
        currentRotate: getTransformValue('rotate') || 0,
      };
    }

    const pointerInfo = {
      pointerId: event.pointerId,
      prevX: event.x,
      prevY: event.y,
      x: event.x,
      y: event.y,
    };

    pointers.push(pointerInfo);
  });


  element.addEventListener('pointermove', (event) => {
    if (!currentGesture) {
      return;
    }

    const currentPointerIndex = pointers.findIndex(
      pointer => pointer.pointerId === event.pointerId,
    );

    // Обработка свайпа
    if (pointers.length === 1) {
      const {
        currentPositionX,
      } = currentGesture;
      const { prevX } = pointers[0];
      const { x } = event;
      const dx = x - prevX;
      let shift = currentPositionX + dx;

      // Ограничение свайпа картинки исходя из ее размеров
      const parentRealWidth = parent.getBoundingClientRect().width;
      const elementRealWidth = element.getBoundingClientRect().width;
      const imageOverflow = parentRealWidth - elementRealWidth;

      // 0.1 - добавлено для того чтобы не было деления 0
      const scaleAdjust = imageOverflow - (parent.clientWidth - element.clientWidth) + 0.01;

      if (imageOverflow > shift + scaleAdjust / 2) {
        shift = imageOverflow - scaleAdjust / 2;
      } else if (shift + scaleAdjust / 2 > 0) {
        shift = 0 - scaleAdjust / 2;
      }

      element.style.left = `${shift}px`;

      pointers[0].prevX = x;
      currentGesture.currentPositionX = shift;

    // Обработка pinch и rotate
    } else if (pointers.length === 2) {
      const anotherPointerIndex = currentPointerIndex === 0 ? 1 : 0;
      const anotherPointer = pointers[anotherPointerIndex];

      let widthRect = anotherPointer.x - event.x;
      let heightRect = anotherPointer.y - event.y;

      const diameter = Math.sqrt((widthRect ** 2) + (heightRect ** 2));

      pointers[currentPointerIndex].x = event.x;
      pointers[currentPointerIndex].y = event.y;

      // обработка вращения
      if (event.pointerId === pointers[1].pointerId) {
        const RAD_TO_DEG = 180 / Math.PI;

        // 0.1 - добавлено для того чтобы не было деления 0
        widthRect = event.x - anotherPointer.x + 0.1;
        heightRect = event.y - anotherPointer.y;

        let angle = Math.atan(-widthRect / heightRect);
        if (heightRect < 0) angle += Math.PI;
        angle *= RAD_TO_DEG;
        if (angle < 0) angle = 360 + angle;

        if (currentGesture.prevRotate !== 0) {
          // убирает скачек при смене угла вращения 360 -> 0
          if (Math.abs(currentGesture.prevRotate - angle) > 300) {
            currentGesture.prevRotate = angle;
          }
          const rotateDiff = currentGesture.prevRotate - angle;
          const rotate = currentGesture.currentRotate - rotateDiff;

          lightValue += rotate * 5 / (360 * 50);

          if (lightValue < 0.5) {
            lightValue = 0.5;
          } else if (lightValue > 5.5) {
            lightValue = 5.5;
          }

          element.style.filter = `brightness(${lightValue})`;

          if (lightValueElement) {
            lightValueElement.innerHTML = String(Math.round((lightValue - 0.5) * 100 / 5));
          }

          currentGesture.currentRotate = rotate;
        }

        currentGesture.prevRotate = angle;
      }

      // реализация pinch
      if (currentGesture.prevRotate !== 0 && currentGesture.prevDiameter !== 0) {
        const diff = currentGesture.prevDiameter - diameter;
        let scale = currentGesture.currentScale - diff / 100;

        // ограничение масштабирования
        if (scale < 1) {
          scale = 1;
        } else if (scale > 10) {
          scale = 10;
        }

        if (Math.abs(diff) > 5) {
          element.style.transform = `scale(${scale})`;
          if (zoomValueElement) zoomValueElement.innerHTML = String(Math.round((scale - 1) * 100 / 9));
          currentGesture.currentScale = scale;
        }
      }

      currentGesture.prevDiameter = diameter;
    }
  });


  const moveToStartPosition = (event) => {
    pointers = pointers.filter(pointer => pointer.pointerId !== event.pointerId);
    currentGesture = null;
  };

  element.addEventListener('pointerup', moveToStartPosition);
  element.addEventListener('pointercancel', moveToStartPosition);
}
