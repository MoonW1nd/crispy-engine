export default function swipeEvent(domNode) {
  const element = domNode;
  let currentGesture = null;

  const nodeState = {
    startPosition: 0,
  };

  element.addEventListener('pointerdown', (event) => {
    element.style.transition = 'none';

    element.setPointerCapture(event.pointerId);
    element.style.userSelect = 'none';
    element.style.touchAction = 'none';

    console.log('start');


    currentGesture = {
      startX: event.x,
      prevX: event.x,
      prevTs: Date.now(),
      startPosition: parseInt(/[-,0-9]+/.exec(element.style.left), 10) || 0,
    };

    console.log(currentGesture.startPosition);
  });

  element.addEventListener('pointermove', (event) => {
    if (!currentGesture) {
      return;
    }

    const {
      startX,
    } = currentGesture;
    const { x } = event;
    const dx = x - startX;
    const ts = Date.now();
    // const speed = Math.abs(x - prevX) / (ts - prevTs);
    const shift = dx;

    element.style.left = `${currentGesture.startPosition + dx}px`;


    currentGesture.prevX = x;
    currentGesture.prevTs = ts;
    nodeState.startPosition = shift;
  });

  const moveToStartPosition = () => {
    if (!currentGesture) {
      return;
    }

    currentGesture = null;
  };

  element.addEventListener('pointerup', moveToStartPosition);
  element.addEventListener('pointercancel', moveToStartPosition);
}


export function pinchEvent(domNode) {
  const element = domNode;
  let pointers = [];
  let currentGesture = null;

  // const nodeState = {
  //   startPosition: 0,
  // };

  element.parentNode.addEventListener('pointerdown', (event) => {
    element.style.transition = 'none';
    element.style.userSelect = 'none';
    element.style.touchAction = 'none';

    element.setPointerCapture(event.pointerId);
    // pointers.push(event);
    console.log(pointers);


    console.log('start');

    const pointerInfo = {
      pointerId: event.pointerId,
      startX: event.x,
      startY: event.y,
      prevX: event.x,
      x: event.x,
      y: event.y,
      startPositionX: parseInt(/[-,0-9]+/.exec(element.style.left), 10) || 0,
      startRotation: 0,
      startScale: 0,
    };

    pointers.push(pointerInfo);


    currentGesture = {
      startX: event.x,
      prevX: event.x,
      prevTs: Date.now(),
      startPosition: parseInt(/[-,0-9]+/.exec(element.style.left), 10) || 0,
      diameter: 0,
      prevDiameter: 0,
      prevZoom: 0,
      currentScale: parseInt(/[-,0-9]+/.exec(element.style.transform), 10) || 1,
    };

    console.log(event.pointerId);
  });

  element.parentNode.addEventListener('pointermove', (event) => {
    if (pointers.length < 2) {
      return;
    }


    const currentPointerIndex = pointers.findIndex(
      pointer => pointer.pointerId === event.pointerId,
    );


    if (pointers.length === 2) {
      const anotherPointerIndex = currentPointerIndex === 0 ? 1 : 0;
      const anotherPointer = pointers[anotherPointerIndex];

      const widthRect = anotherPointer.x - event.x;
      const heightRect = anotherPointer.y - event.y;


      // console.log(widthRect, heightRect);

      const diameter = Math.sqrt((widthRect ** 2) + (heightRect ** 2));

      pointers[currentPointerIndex].x = event.x;
      pointers[currentPointerIndex].y = event.y;

      console.log(diameter);

      if (currentGesture.prevDiameter !== 0) {
        const diff = currentGesture.prevDiameter - diameter;
        let scale = currentGesture.currentScale - diff / 100;
        if (scale < 1) {
          scale = 1;
        }
        element.style.transform = `scale(${scale})`;

        currentGesture.currentScale = scale;
        console.log(scale);
      }

      currentGesture.prevDiameter = diameter;
      // console.log(diameter);
    }


    // console.log('pointermove', event.pointerId);
  });

  const moveToStartPosition = (event) => {
    pointers = pointers.filter(pointer => pointer.pointerId !== event.pointerId);
    console.log('pointermove', event.pointerId, pointers);
  };

  element.parentNode.addEventListener('pointerup', moveToStartPosition);
  element.parentNode.addEventListener('pointercancel', moveToStartPosition);
}
