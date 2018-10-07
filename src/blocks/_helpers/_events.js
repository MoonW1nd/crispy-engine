export default function touchEvents(parentNode, domNode) {
  const element = domNode;
  const parent = parentNode;
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
      const shift = currentPositionX + dx;

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


      // if (pointers.length === 2 && event.pointerId === pointers[1].pointerId) {
      // let coords = getCoords(manipulator);
      if (event.pointerId === pointers[1].pointerId) {
        const RAD_TO_DEG = 180 / Math.PI;

        // 0.1 - добавлено для того чтобы не было деления 0
        // const centerX = anotherPointer.x - event.x / 2;
        const centerX = anotherPointer.x;
        // const centerY = anotherPointer.y - event.y / 2;
        const centerY = anotherPointer.y;
        widthRect = event.x - centerX + 0.1;
        heightRect = event.y - centerY;
        let angle = Math.atan(-widthRect / heightRect);

        if (heightRect < 0) angle += Math.PI;
        angle *= RAD_TO_DEG;
        if (angle < 0) angle = 360 + angle;
        // console.log(angle);

        if (currentGesture.prevRotate !== 0) {
          const rotateDiff = currentGesture.prevRotate - angle;
          // const rotate = currentGesture.currentRotate - rotateDiff

          currentGesture.currentRotate = rotateDiff;
        }

        currentGesture.prevRotate = angle;
      }

      let diff = 0;

      if (currentGesture.prevRotate !== 0 && currentGesture.prevDiameter !== 0) {
        // debugger;
        // const rotateDiff = currentGesture.prevRotate - angle;
        // const rotate = currentGesture.currentRotate - rotateDiff;
        diff = currentGesture.prevDiameter - diameter;
        let scale = currentGesture.currentScale - diff / 100;
        if (scale < 1) {
          scale = 1;
        }

        if (Math.abs(diff) > 5) {
          element.style.transform = `scale(${scale})`;
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
