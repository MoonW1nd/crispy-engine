/* global requestAnimationFrame Hls isNaN document */
import { getTemplateContent, getBox } from '../_helpers/_helpers';
import brightness from './filters/brightness.filter';
import contrast from './filters/contrast.filter';

export default class VideoPlayer {
  constructor(options = {}) {
    this.parent = options.parent;
    this.url = options.url;
    this.button = options.button;
    this.lightController = options.lightController;
    this.contrastController = options.contrastController;
    this.audioAnalyser = options.audioAnalyser;
    this.setIntervalIndex = null;
    this.dom = {};
    this.typeGrid = true;
    this.id = typeof VideoPlayer.id === 'number' && !Number.isNaN(VideoPlayer.id)
      ? VideoPlayer.id + 1
      : 0;
    VideoPlayer.id = this.id;
    this.isFullScreen = false;
    this.brightnessFilter = () => {};
    this.contrastFilter = () => {};
    this.analyserFunction = () => {};
    this.brightness = 0;
    this.contrast = 0;
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
    this.brightnessFilter = () => {};
    this.initVideo();
    this.initCanvas();
  }

  initCanvas() {
    this.dom.canvas.width = this.dom.video.offsetWidth;
    this.dom.canvas.height = this.dom.video.offsetHeight;

    const ctxVideoArea = this.dom.canvas.getContext('2d');
    this.loop(ctxVideoArea);
  }

  loop(context) {
    const loop = () => {
      context.fillRect(0, 0, this.dom.canvas.width, this.dom.canvas.height);
      context.drawImage(this.dom.video, 0, 0);
      this.brightnessFilter(context);
      this.contrastFilter(context);
      this.analyserFunction();
      requestAnimationFrame(loop);
    };

    loop();
  }

  brightnessChange(value) {
    if (this.isFullScreen) {
      this.brightness = value;

      this.brightnessFilter = (context) => {
        const imageData = context.getImageData(0, 0, this.dom.canvas.width, this.dom.canvas.height);

        const imageDataFiltered = brightness(imageData, Number(value));

        context.putImageData(imageDataFiltered, 0, 0);
      };
    }
  }

  contrastChange(value) {
    if (this.isFullScreen) {
      this.contrast = value;

      this.contrastFilter = (context) => {
        const imageData = context.getImageData(0, 0, this.dom.canvas.width, this.dom.canvas.height);

        const imageDataFiltered = contrast(imageData, Number(value));

        context.putImageData(imageDataFiltered, 0, 0);
      };
    }
  }

  openFullScreen() {
    const overlay = document.importNode(this.player, false);
    overlay.classList.add('VideoPlayer-Clone');
    const { canvas } = this.dom;
    canvas.classList.add('VideoPlayer-Canvas_fullscreen');
    this.parent.parentNode.appendChild(canvas);
    this.parent.parentNode.appendChild(overlay);
    this.dom.overlay = overlay;
    this.typeGrid = false;

    const playerBox = getBox(this.player);
    const fullScreenAreaBox = getBox(this.parent.parentNode);

    overlay.style.width = `${playerBox.width}px`;
    overlay.style.height = `${playerBox.height}px`;
    overlay.style.left = `${playerBox.left - fullScreenAreaBox.left}px`;
    overlay.style.top = `${playerBox.top - fullScreenAreaBox.top}px`;

    canvas.style.width = `${playerBox.width}px`;
    canvas.style.height = `${playerBox.height}px`;
    canvas.style.left = `${playerBox.left - fullScreenAreaBox.left}px`;
    canvas.style.top = `${playerBox.top - fullScreenAreaBox.top}px`;

    // рассчитываем transformOrigin
    const playerRelativeTop = playerBox.top - fullScreenAreaBox.top;
    const playerAreaY = fullScreenAreaBox.height - playerBox.height;

    const playerRelativeLeft = playerBox.left - fullScreenAreaBox.left;
    const playerAreaX = fullScreenAreaBox.width - playerBox.width;

    const transformOriginX = (playerRelativeLeft / playerAreaX) * 100;
    const transformOriginY = (playerRelativeTop / playerAreaY) * 100;

    document.querySelector('body').style.overflow = 'hidden';

    overlay.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`;
    // canvas.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`;

    // рассчитываем коэффициенты трансформации и устанавливаем их
    const resolution = this.getVideoAspectRatio();
    let scaleX;
    let scaleY;

    if (resolution <= fullScreenAreaBox.width / fullScreenAreaBox.height) {
      canvas.style.width = '';
      scaleX = (fullScreenAreaBox.height * resolution) / (playerBox.height * resolution);
      scaleY = fullScreenAreaBox.height / playerBox.height;
    } else {
      canvas.style.height = '';
      scaleX = fullScreenAreaBox.width / playerBox.width;
      scaleY = (fullScreenAreaBox.width / resolution) / (playerBox.width / resolution);
    }

    const cloneCanvas = this.dom.canvas.cloneNode();
    cloneCanvas.style.transform = `scaleY(${scaleY}) scaleX(${scaleX}) translate(0px, 0px)`;
    this.parent.appendChild(cloneCanvas);
    const cloneBox = cloneCanvas.getBoundingClientRect();
    cloneCanvas.parentNode.removeChild(cloneCanvas);

    const canvasOffsetY = ((-cloneBox.top + fullScreenAreaBox.top) / scaleY)
      + ((fullScreenAreaBox.height - cloneBox.height) / scaleY / 2);
    const canvasOffsetX = ((-cloneBox.left + fullScreenAreaBox.left) / scaleX)
      + ((fullScreenAreaBox.width - cloneBox.width) / scaleX / 2);
    setTimeout(() => {
      canvas.style.transform = `scaleY(${scaleY}) scaleX(${scaleX}) translate(${canvasOffsetX}px, ${canvasOffsetY}px)`;
    }, 0);

    const scaleRatioX = fullScreenAreaBox.width / playerBox.width;
    const scaleRatioY = fullScreenAreaBox.height / playerBox.height;
    overlay.style.transform = `scaleX(${scaleRatioX * 1.1}) scaleY(${scaleRatioY * 1.1})`;

    // установка качества видео
    setTimeout(() => {
      const currentLevel = this.getCorrectQualityLevel(fullScreenAreaBox);
      this.hls.currentLevel = currentLevel;
      canvas.width = this.hls.levels[currentLevel].width;
      canvas.height = this.hls.levels[currentLevel].height;

      this.lightController.dom.input.value = this.brightness;
      this.contrastController.dom.input.value = this.contrast;

      this.button.show();
      this.lightController.show();
      this.contrastController.show();
      this.audioAnalyser.show();
      this.isFullScreen = true;
      this.dom.video.muted = false;
    }, 500);
  }

  closeFullScreen() {
    const { overlay, canvas } = this.dom;

    if (overlay == null) {
      return;
    }

    this.button.hide();
    this.lightController.hide();
    this.contrastController.hide();
    this.audioAnalyser.hide();
    this.dom.video.muted = true;
    overlay.style.transform = 'scale(1)';
    canvas.style.transform = 'scale(1) translate(0px, 0px)';

    setTimeout(() => {
      canvas.classList.remove('VideoPlayer-Canvas_fullscreen');

      this.player.appendChild(canvas);
      overlay.parentNode.removeChild(overlay);
      this.dom.overlay = null;

      this.typeGrid = true;
      this.hls.currentLevel = 0;

      canvas.style.width = '';
      canvas.style.height = '';
      canvas.style.transform = '';
      canvas.style.transformOrigin = '';
      canvas.style.left = 0;
      canvas.style.top = 0;
      canvas.width = this.hls.levels[0].width;
      canvas.height = this.hls.levels[0].height;
      this.isFullScreen = false;
    }, 300);
  }

  initVideo() {
    const { video } = this.dom;

    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        maxBufferLength: 200,
        maxMaxBufferLength: 100,
        maxBufferSize: 200 * 1000 * 1000,
        maxBufferHole: 0.1,
        highBufferWatchdogPeriod: 0.1,
      });
      hls.loadSource(this.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
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

      hls.on(Hls.Events.ERROR, (event, data) => {
        const errorType = data.type;
        const errorFatal = data.fatal;
        if (errorFatal) {
          switch (errorType) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('fatal network error encountered, try to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
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
    const currentLevel = heightLevel <= widthLevel ? heightLevel - 1 : widthLevel - 1;
    return currentLevel <= 0 ? 0 : currentLevel;
  }

  getVideoAspectRatio() {
    this.currentLevel = this.hls.currentLevel === -1 ? 0 : this.hls.currentLevel;
    return this.hls.levels[this.currentLevel].width / this.hls.levels[this.currentLevel].height;
  }
}
