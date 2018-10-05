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

    currentGesture = {
      startX: event.x,
      prevX: event.x,
      prevTs: Date.now(),
      startPosition: nodeState.startPosition,
    };
  });

  element.addEventListener('pointermove', (event) => {
    if (!currentGesture) {
      return;
    }

    const {
      startX, prevX, prevTs,
    } = currentGesture;
    const { x } = event;
    const dx = x - startX;
    const ts = Date.now();
    const speed = Math.abs(x - prevX) / (ts - prevTs);
    const shift = dx;

    if (speed > 0.5 && ts !== prevTs) {
      element.style.left = `${shift}px`;
    }


    currentGesture.prevX = x;
    currentGesture.prevTs = ts;
    nodeState.startPosition = shift;
  });

  const moveToStartPosition = () => {
    if (!currentGesture) {
      return;
    }

    currentGesture = null;
    element.style.transition = 'left ease .5s';
    element.style.left = nodeState.startPosition;
  };

  element.addEventListener('pointerup', moveToStartPosition);
  element.addEventListener('pointercancel', moveToStartPosition);
}
