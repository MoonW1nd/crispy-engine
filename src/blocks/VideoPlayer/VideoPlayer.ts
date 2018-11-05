/* global requestAnimationFrame Hls isNaN document */
import { getBox, getTemplateContent, IElementBox } from 'blocks/_helpers/_helpers';
import brightness from 'blocks/VideoPlayer/filters/brightness.filter';
import contrast from 'blocks/VideoPlayer/filters/contrast.filter';
import Hls from 'hls.js';
import AudioAnalyser from '../AudioAnalyser/AudioAnalyser';
import Button from '../Button/Button';
import RangeController from '../RangeController/RangeController';

interface IVideoPlayerDOMObject {
  video: HTMLVideoElement | null;
  canvas: HTMLCanvasElement | null;
  overlay: HTMLVideoElement | null;
}

type IFilterFunction = (context: CanvasRenderingContext2D) => void;

interface IVideoPlayerOptions {
  parent: HTMLElement;
  url: string;
  button: Button;
  buttonPlay: Button;
  lightController: RangeController;
  contrastController: RangeController;
  audioAnalyser?: AudioAnalyser;
}

export default class VideoPlayer {
  public static id: number;
  public id: number;
  public parent: HTMLElement;
  public url: string;
  public button: Button;
  public buttonPlay: Button;
  public lightController: RangeController;
  public contrastController: RangeController;
  public audioAnalyser: AudioAnalyser | undefined;
  public currentLevel: number;
  public hls: Hls | null;
  public dom: IVideoPlayerDOMObject;
  public typeGrid: boolean;
  public isFullScreen: boolean;
  public brightnessFilter: null | IFilterFunction;
  public contrastFilter: null | IFilterFunction;
  public analyserFunction: null | (() => void);
  public brightness: number;
  public contrast: number;
  public player: HTMLVideoElement | null;

  constructor(options: IVideoPlayerOptions) {
    this.parent = options.parent;
    this.url = options.url;
    this.button = options.button;
    this.buttonPlay = options.buttonPlay;
    this.lightController = options.lightController;
    this.contrastController = options.contrastController;
    this.audioAnalyser = options.audioAnalyser;
    this.hls = null;
    this.currentLevel = 0;
    this.dom = {
      canvas: null,
      overlay: null,
      video: null,
    };
    this.typeGrid = true;
    this.id = typeof VideoPlayer.id === 'number' && !Number.isNaN(VideoPlayer.id)
      ? VideoPlayer.id + 1
      : 0;
    VideoPlayer.id = this.id;
    this.isFullScreen = false;
    this.brightnessFilter = null;
    this.contrastFilter = null;
    this.analyserFunction = null;
    this.brightness = 0;
    this.contrast = 0;
    this.player = null;
    this.render();
  }

  public render() {
    const templateContent = getTemplateContent('VideoPlayerTemplate');
    const templatePlayer = templateContent.querySelector('.VideoPlayer');
    if (templatePlayer == null) { throw Error('Не найден шаблон'); }
    templatePlayer.classList.add(`VideoPlayer_id_${this.id}`);

    const clone = document.importNode(templateContent, true);

    this.parent.appendChild(clone);
    this.player = this.parent.querySelector(`.VideoPlayer_id_${this.id}`);
    this.dom.video = this.parent.querySelector(`.VideoPlayer_id_${this.id} .VideoPlayer-Video`);
    this.dom.canvas = this.parent.querySelector(`.VideoPlayer_id_${this.id} .VideoPlayer-Canvas`);

    if (this.dom.video) {
      this.dom.video.classList.add('VideoPlayer_hidden');
    }

    this.initVideo();
    this.initCanvas();
  }

  public initCanvas() {
    if (this.dom.canvas && this.dom.video) {
      this.dom.canvas.width = this.dom.video.offsetWidth;
      this.dom.canvas.height = this.dom.video.offsetHeight;

      const ctxVideoArea = this.dom.canvas.getContext('2d');

      if (ctxVideoArea) { this.loop(ctxVideoArea); }
    } else {
      throw new Error('Видео плеер еще не отрисован в DOM');

    }
  }

  public loop(context: CanvasRenderingContext2D) {
    const loop = () => {
      if (this.dom.canvas && this.dom.video) {
        context.fillRect(0, 0, this.dom.canvas.width, this.dom.canvas.height);
        context.drawImage(this.dom.video, 0, 0);
        if (this.brightnessFilter) { this.brightnessFilter(context); }
        if (this.contrastFilter) { this.contrastFilter(context); }
        if (this.analyserFunction) { this.analyserFunction(); }
        requestAnimationFrame(loop);
      }
    };

    loop();
  }

  public brightnessChange(value: number) {
    this.brightness = value;

    this.brightnessFilter = (context) => {
      if (this.dom.canvas) {
        const imageData = context.getImageData(0, 0, this.dom.canvas.width, this.dom.canvas.height);
        const imageDataFiltered = brightness(imageData, Number(value));

        context.putImageData(imageDataFiltered, 0, 0);
      }
    };
  }

  public contrastChange(value: number) {
    this.contrast = value;

    this.contrastFilter = (context) => {
      if (this.dom.canvas) {
        const imageData = context.getImageData(0, 0, this.dom.canvas.width, this.dom.canvas.height);
        const imageDataFiltered = contrast(imageData, Number(value));

        context.putImageData(imageDataFiltered, 0, 0);
      }
    };
  }

  public openFullScreen() {
    if (!this.player || !this.dom.canvas || !this.dom.video) { throw new Error('Видео плеер не отрисован'); }
    const overlay = document.importNode(this.player, false);
    const { canvas } = this.dom;
    overlay.classList.add('VideoPlayer-Clone');
    canvas.classList.add('VideoPlayer-Canvas_fullscreen');

    if (this.parent.parentNode === null) { throw Error('Видео плеер находится не в DOM'); }
    this.parent.parentNode.appendChild(canvas);
    this.parent.parentNode.appendChild(overlay);
    this.dom.overlay = overlay;
    this.typeGrid = false;
    this.dom.video.play();

    const playerBox = getBox(this.player);
    const fullScreenAreaBox = getBox(this.parent.parentElement);

    // устанавливаем размеры для и позицию для элементов которые будут открываться на полный экран
    overlay.style.width = `${playerBox.width}px`;
    overlay.style.height = `${playerBox.height}px`;
    overlay.style.left = `${playerBox.left - fullScreenAreaBox.left}px`;
    overlay.style.top = `${playerBox.top - fullScreenAreaBox.top}px`;

    canvas.style.width = overlay.style.width;
    canvas.style.height = overlay.style.height;
    canvas.style.left = overlay.style.left;
    canvas.style.top = overlay.style.top;

    // рассчитываем transformOrigin
    const playerRelativeTop = playerBox.top - fullScreenAreaBox.top;
    const playerAreaY = fullScreenAreaBox.height - playerBox.height;

    const playerRelativeLeft = playerBox.left - fullScreenAreaBox.left;
    const playerAreaX = fullScreenAreaBox.width - playerBox.width;

    const transformOriginX = (playerRelativeLeft / playerAreaX) * 100;
    const transformOriginY = (playerRelativeTop / playerAreaY) * 100;

    const body = document.querySelector('body');
    if (body) {  body.style.overflow = 'hidden'; }

    overlay.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`;

    // рассчитываем коэффициенты трансформации и устанавливаем их
    const resolution = this.getVideoAspectRatio();
    let scaleX: number;
    let scaleY: number;

    if (resolution <= fullScreenAreaBox.width / fullScreenAreaBox.height) {
      canvas.style.width = '';
      scaleX = (fullScreenAreaBox.height * resolution) / (playerBox.height * resolution);
      scaleY = fullScreenAreaBox.height / playerBox.height;
    } else {
      canvas.style.height = '';
      scaleX = fullScreenAreaBox.width / playerBox.width;
      scaleY = (fullScreenAreaBox.width / resolution) / (playerBox.width / resolution);
    }

    const cloneCanvas = this.dom.canvas.cloneNode() as HTMLElement;
    cloneCanvas.style.transform = `scaleY(${scaleY}) scaleX(${scaleX}) translate(0px, 0px)`;
    this.parent.appendChild(cloneCanvas);

    const cloneBox = cloneCanvas.getBoundingClientRect();
    const cloneParent = cloneCanvas.parentNode;
    if (cloneParent) { cloneParent.removeChild(cloneCanvas); }

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
      if (this.hls) {
        this.hls.currentLevel = currentLevel;
        canvas.width = this.hls.levels[currentLevel].width;
        canvas.height = this.hls.levels[currentLevel].height;

        if (this.lightController.dom.input) {
          this.lightController.dom.input.value = String(this.brightness);
        }

        if (this.contrastController.dom.input) {
          this.contrastController.dom.input.value = String(this.contrast);
        }

        this.button.show();
        this.lightController.show();
        this.contrastController.show();
        if (this.audioAnalyser) { this.audioAnalyser.show(); }
        this.isFullScreen = true;
        if (this.dom.video) { this.dom.video.muted = false; }
      } else {
        throw Error('Похоже VideoPlayer не инициализирован');
      }
    }, 500);
  }

  public closeFullScreen() {
    const { overlay, canvas } = this.dom;

    if (overlay == null) {
      return;
    }

    if (canvas === null) { throw Error(' видео не отрисовано'); }

    this.button.hide();
    this.lightController.hide();
    this.contrastController.hide();
    if (this.audioAnalyser) { this.audioAnalyser.hide(); }
    overlay.style.transform = 'scale(1)';
    canvas.style.transform = 'scale(1) translate(0px, 0px)';

    setTimeout(() => {
      if (this.hls === null) { throw Error('Похоже VideoPlayer не инициализирован'); }
      if (!this.player || !this.dom.video) { throw Error(' видео не отрисовано'); }

      canvas.classList.remove('VideoPlayer-Canvas_fullscreen');

      this.player.appendChild(canvas);
      const overlayParent = overlay.parentNode;
      if (overlayParent == null) {throw Error('Видео плеер находится не в DOM'); }
      overlayParent.removeChild(overlay);
      this.dom.overlay = null;

      this.typeGrid = true;
      this.hls.currentLevel = 0;

      canvas.style.width = '';
      canvas.style.height = '';
      canvas.style.transform = '';
      canvas.style.transformOrigin = '';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.width = this.hls.levels[0].width;
      canvas.height = this.hls.levels[0].height;
      this.isFullScreen = false;
      this.dom.video.muted = true;

      const DEFAULT_ASPECT_RATIO = 1.75;
      const resolution = this.getVideoAspectRatio();

      if (resolution >= DEFAULT_ASPECT_RATIO && this.typeGrid) {
        canvas.style.height = '100%';
      } else if (this.typeGrid) {
        canvas.style.width = '100%';
      }

      this.dom.video.play();
    }, 300);
  }

  public initVideo() {
    const { video } = this.dom;
    if (video == null) { throw Error(' видео не отрисовано'); }
    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        highBufferWatchdogPeriod: 0.1,
        maxBufferHole: 0.1,
        maxBufferLength: 200,
        maxBufferSize: 200 * 1000 * 1000,
        maxMaxBufferLength: 100,
      });
      hls.loadSource(this.url);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.attachMedia(video);
        video.play()
          .catch(() => {
            this.buttonPlay.show();
            if (this.buttonPlay.view) {
              this.buttonPlay.view.addEventListener('click', () => {
                video.play();
                this.buttonPlay.hide();
              });
            }
          });
      });

      this.hls = hls;
      this.hls.currentLevel = 0;
      this.currentLevel = 0;

      hls.on(Hls.Events.LEVEL_SWITCHED, () => {
        const DEFAULT_ASPECT_RATIO = 1.75;
        const resolution = this.getVideoAspectRatio();

        if (this.dom.canvas) {
          if (resolution >= DEFAULT_ASPECT_RATIO && this.typeGrid) {
            this.dom.canvas.style.height = '100%';
          } else if (this.typeGrid) {
            this.dom.canvas.style.width = '100%';
          }

          this.dom.canvas.width = hls.levels[this.currentLevel].width;
          this.dom.canvas.height = hls.levels[this.currentLevel].height;
        }
      });

      // Обработка критических ошибок
      hls.on(Hls.Events.ERROR, (event, data) => {
        const errorType = data.type;
        const errorFatal = data.fatal;
        if (errorFatal) {
          switch (errorType) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
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
        video.play()
          .catch(() => {
            if (this.buttonPlay.view) {
              this.buttonPlay.show();
              this.buttonPlay.view.addEventListener('click', () => {
                video.play();
                this.buttonPlay.hide();
              });
            }
          });
      });
    }
  }

  public getCorrectQualityLevel(fullScreenAreaBox: IElementBox) {
    let previousWidth = 0;
    let previousHeight = 0;
    let heightLevel = 0;
    let widthLevel = 0;

    if (!this.hls) { throw Error('Похоже VideoPlayer не инициализирован'); }

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

  public getVideoAspectRatio() {
    if (!this.hls) { throw Error('Похоже VideoPlayer не инициализирован'); }
    this.currentLevel = this.hls.currentLevel === -1 ? 0 : this.hls.currentLevel;
    return this.hls.levels[this.currentLevel].width / this.hls.levels[this.currentLevel].height;
  }
}
