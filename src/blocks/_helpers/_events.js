export default function touchEvents(parentNode, domNode) {
  const element = domNode;
  const parent = parentNode;
  const zoomValueElement = parent.parentNode.querySelector('.DataInfo-ZoomValue');
  const lightValueElement = parent.parentNode.querySelector('.DataInfo-LightValue');
  let lightValue = 1;
  let currentGesture = null;
  let pointers = [];


  function getTransformValue(valueName) {
    const transformValue = element.style.transform;
    let value = null;

    transformValue.split(' ').forEach((rule) => {
      const regexp = new RegExp(valueName);
      if (regexp.test(rule)) {
        value = parseFloat(/[-,0-9,.]+/.exec(rule));
      }
    });

    return value;
  }


  parent.addEventListener('pointerdown', (event) => {
    element.setPointerCapture(event.pointerId);
    parent.style.transition = 'none';
    parent.style.userSelect = 'none';
    parent.style.touchAction = 'none';

    currentGesture = {
      prevDiameter: 0,
      prevRotate: 0,
      currentPositionX: parseInt(/[-,0-9]+/.exec(element.style.left), 10) || 0,
      currentScale: getTransformValue('scale') || 1,
      currentRotate: getTransformValue('rotate') || 0,
    };

    const pointerInfo = {
      pointerId: event.pointerId,
      startX: event.x,
      startY: event.y,
      prevX: event.x,
      prevY: event.y,
      x: event.x,
      y: event.y,
      startPositionX: parseInt(/[-,0-9]+/.exec(element.style.left), 10) || 0,
      startRotation: 0,
      startScale: 0,
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

    if (pointers.length === 1) {
      const {
        currentPositionX,
      } = currentGesture;
      const { prevX } = pointers[0];
      const { x } = event;
      const dx = x - prevX;
      let shift = currentPositionX + dx;

      const scaleAdjust = (parent.getBoundingClientRect().width
        - element.getBoundingClientRect().width)
        - (parent.clientWidth - element.clientWidth) + 0.01;

      if ((parent.getBoundingClientRect().width
        - (element.getBoundingClientRect().width)) > shift + scaleAdjust / 2) {
        shift = parent.getBoundingClientRect().width
          - element.getBoundingClientRect().width - scaleAdjust / 2;
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
        const centerX = anotherPointer.x;
        const centerY = anotherPointer.y;

        // 0.1 - добавлено для того чтобы не было деления 0
        widthRect = event.x - centerX + 0.1;
        heightRect = event.y - centerY;

        let angle = Math.atan(-widthRect / heightRect);
        if (heightRect < 0) angle += Math.PI;
        angle *= RAD_TO_DEG;
        if (angle < 0) angle = 360 + angle;

        if (currentGesture.prevRotate !== 0) {
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
          lightValueElement.innerHTML = Math.round((lightValue - 0.5) * 100 / 5);

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
          zoomValueElement.innerHTML = Math.round((scale - 1) * 100 / 9);
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
