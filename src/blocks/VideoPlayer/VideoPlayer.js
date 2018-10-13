/* global requestAnimationFrame Hls isNaN document */
import { getTemplateContent, getBox } from '../_helpers/_helpers';

export default class VideoPlayer {
  constructor(options = {}) {
    this.parent = options.parent;
    this.url = options.url;
    this.setIntervalIndex = null;
    this.dom = {};
    this.typeGrid = true;
    this.id = typeof VideoPlayer.id === 'number' && !Number.isNaN(VideoPlayer.id)
      ? VideoPlayer.id + 1
      : 0;
    VideoPlayer.id = this.id;
    this.render();
  }

  render() {
    const templateContent = getTemplateContent('VideoPlayerTemplate');
    const templatePlayer = templateContent.querySelector('.VideoPlayer');
    templatePlayer.classList.add(`VideoPlayer_id_${this.id}`);

    const clone = document.importNode(templateContent, true);

    this.parent.appendChild(clone);
    this.player = this.parent.querySelector(`.VideoPlayer_id_${this.id}`);
    this.dom.video = this.parent.querySelector(`.VideoPlayer_id_${this.id} .VideoPlayer-Video`);
    this.dom.canvas = this.parent.querySelector(`.VideoPlayer_id_${this.id} .VideoPlayer-Canvas`);
    this.dom.video.classList.add('VideoPlayer_hidden');
    this.initVideo();
    this.initCanvas();
  }

  initCanvas() {
    // this.dom.video.width = this.dom.video.offsetWidth;
    // this.dom.video.width = this.dom.video.offsetWidth;
    this.dom.canvas.width = this.dom.video.offsetWidth;
    this.dom.canvas.height = this.dom.video.offsetHeight;

    const ctxVideoArea = this.dom.canvas.getContext('2d');
    this.loop(ctxVideoArea);
  }

  loop(context) {
    const loop = () => {
      context.drawImage(this.dom.video, 0, 0);
      requestAnimationFrame(loop);
    };

    loop();
  }

  openFullScreen() {
    const clone = document.importNode(this.player, true);
    clone.classList.add('VideoPlayer-Clone');
    const canvas = this.player.querySelector('.VideoPlayer-Canvas');
    clone.removeChild(clone.querySelector('.VideoPlayer-Canvas'));
    const canvasInitialBox = getBox(canvas);
    canvas.classList.add('VideoPlayer-Canvas_fullscreen');
    this.parent.parentNode.appendChild(canvas);
    this.parent.parentNode.appendChild(clone);
    this.typeGrid = false;

    const playerBox = getBox(this.player);
    const fullScreenAreaBox = getBox(this.parent.parentNode);

    clone.style.width = `${playerBox.width}px`;
    clone.style.height = `${playerBox.height}px`;
    clone.style.left = `${playerBox.left}px`;
    clone.style.top = `${playerBox.top - fullScreenAreaBox.top}px`;

    canvas.style.width = `${playerBox.width}px`;
    canvas.style.height = `${playerBox.height}px`;


    // const currentLevel = this.getCorrectQualityLevel(fullScreenAreaBox);
    // this.hls.currentLevel = currentLevel;


    const resolution = this.getVideoAspectRatio();
    if (resolution <= fullScreenAreaBox.width / fullScreenAreaBox.height) {
      canvas.style.width = '';
      const canvasOffsetX = (fullScreenAreaBox.width - fullScreenAreaBox.height * resolution) / 2;
      setTimeout(() => {
        canvas.style.height = `${fullScreenAreaBox.height}px`;
        canvas.style.left = `${canvasOffsetX}px`;
      }, 0);
    } else {
      canvas.style.height = '';
      const canvasOffsetY = (fullScreenAreaBox.height - (fullScreenAreaBox.width / resolution)) / 2;
      setTimeout(() => {
        canvas.style.width = `${fullScreenAreaBox.width}px`;
        canvas.style.top = `${canvasOffsetY}px`;
      }, 0);
    }

    console.log(canvas.style.width);

    // canvas.width = this.hls.levels[currentLevel].width;
    // canvas.height = this.hls.levels[currentLevel].height;

    this.parent.parentNode.appendChild(canvas);
    canvas.classList.add('VideoPlayer-Canvas_fullscreen');
    const cloneContext = canvas.getContext('2d');


    const loop = () => {
      cloneContext.drawImage(this.dom.video, 0, 0);
      requestAnimationFrame(loop);
    };

    loop();

    const playerRelativeTop = playerBox.top - fullScreenAreaBox.top;
    const playerAreaY = fullScreenAreaBox.height - playerBox.height;

    const playerRelativeLeft = playerBox.left - fullScreenAreaBox.left;
    const playerAreaX = fullScreenAreaBox.width - playerBox.width;

    const transformOriginX = playerRelativeLeft / playerAreaX;
    const transformOriginY = playerRelativeTop / playerAreaY;

    console.log(transformOriginX, transformOriginY);

    document.querySelector('body').style.overflow = 'hidden';

    clone.style.transformOrigin = `${transformOriginX * 100}% ${transformOriginY * 100}%`;


    const scaleRatioX = fullScreenAreaBox.width / playerBox.width;
    const scaleRatioY = fullScreenAreaBox.height / playerBox.height;
    clone.style.transform = `scaleX(${scaleRatioX * 1}) scaleY(${scaleRatioY * 1})`;

    setTimeout(() => {
      const currentLevel = this.getCorrectQualityLevel(fullScreenAreaBox);
      this.hls.currentLevel = currentLevel;
      canvas.width = this.hls.levels[currentLevel].width;
      canvas.height = this.hls.levels[currentLevel].height;
    }, 1000);


    clone.addEventListener('click', () => {
      clone.style.transform = 'scale(1)';
      canvas.style.width = `${canvasInitialBox.width}px`;
      canvas.style.height = `${canvasInitialBox.height}px`;
      setTimeout(() => {
        canvas.parentNode.removeChild(canvas);
        clone.parentNode.removeChild(clone);
      }, 300);
    });
  }

  initVideo() {
    const { video } = this.dom;

    if (Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: true });
      hls.loadSource(this.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      this.hls = hls;
      this.hls.currentLevel = 0;
      this.currentLevel = 0;

      hls.on(Hls.Events.LEVEL_SWITCHED, () => {
        const DEFAULT_ASPECT_RATIO = 1.75;
        const resolution = this.getVideoAspectRatio();

        if (resolution >= DEFAULT_ASPECT_RATIO && this.typeGrid) {
          this.dom.canvas.style.height = '100%';
        } else if (this.typeGrid) {
          this.dom.canvas.style.width = '100%';
        }

        this.dom.canvas.width = this.hls.levels[this.currentLevel].width;
        this.dom.canvas.height = this.hls.levels[this.currentLevel].height;
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }


  getCorrectQualityLevel(fullScreenAreaBox) {
    let previousWidth = 0;
    let previousHeight = 0;
    let heightLevel = 0;
    let widthLevel = 0;

    this.hls.levels.forEach((level) => {
      if (previousWidth < level.width && level.width < fullScreenAreaBox.width) {
        widthLevel += 1;
      }
      if (previousHeight < level.height && level.height < fullScreenAreaBox.height) {
        heightLevel += 1;
      }
      previousWidth = level.width;
      previousHeight = level.height;
    });

    return heightLevel <= widthLevel ? heightLevel - 1 : widthLevel - 1;
  }

  getVideoAspectRatio() {
    this.currentLevel = this.hls.currentLevel === -1 ? 0 : this.hls.currentLevel;
    return this.hls.levels[this.currentLevel].width / this.hls.levels[this.currentLevel].height;
  }
}
