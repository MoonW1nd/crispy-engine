/* global requestAnimationFrame Hls isNaN document */
import { getTemplateContent, getBox } from '../_helpers/_helpers';

export default class VideoPlayer {
  constructor(options = {}) {
    this.parent = options.parent;
    this.url = options.url;
    this.setIntervalIndex = null;
    this.dom = {};
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
    this.parent.parentNode.appendChild(clone);

    // this.dom.video.style.height = '518px'; //1.333 640/480
    // this.dom.video.style.width = `${518 * 1.33}px`;
    const playerBox = getBox(this.player);
    // const videoBox = getBox(this.dom.video);

    clone.style.width = `${playerBox.width}px`;
    clone.style.height = `${playerBox.height}px`;
    clone.style.left = `${playerBox.left}px`;
    clone.style.top = `${playerBox.top}px`;

    const fullScreenAreaBox = getBox(this.parent.parentNode);
    // const windowWidth = document.documentElement.clientWidth;
    // const windowHeight = document.documentElement.clientHeight;

    // let previousWidth = 0;
    // let previousHeight = 0;
    // let heightLevel = 0;
    // let widthLevel = 0;

    // this.hls.levels.forEach((level) => {
    //   if (previousWidth < level.width  && level.width < windowWidth) {
    //     widthLevel += 1;
    //   }
    //   if (previousHeight < level.height  && level.height < windowHeight) {
    //     heightLevel += 1;
    //   }
    //   previousWidth = level.width;
    //   previousHeight = level.height;
    // });

    // const currentLevel = heightLevel <= widthLevel ? heightLevel : widthLevel;

    // const currentWidth = `${this.hls.levels[currentLevel - 1].width}px`;
    // const currentHeight = `${this.hls.levels[currentLevel - 1].height}px`;

    // this.hls.currentLevel = currentLevel - 1;

    // this.dom.video.style.height = currentHeight;
    // this.dom.video.style.width = currentWidth;


    const canvas = clone.querySelector('.VideoPlayer-Canvas');

    canvas.style.left = '0';
    canvas.style.top = '0';

    const resolution = this.getVideoAspectRatio();

    if (resolution <= fullScreenAreaBox.width / fullScreenAreaBox.height) {
      canvas.style.height = `${fullScreenAreaBox.height}px`;
      canvas.style.width = '';
    } else {
      canvas.style.height = '';
      canvas.style.width = `${fullScreenAreaBox.width}px`;
    }
    // canvas.width = this.hls.levels[currentLevel - 1].width;
    // canvas.style.height = currentHeight;
    // canvas.height = this.hls.levels[currentLevel - 1].height;

    this.parent.parentNode.appendChild(canvas);
    canvas.classList.add('VideoPlayer-Canvas_fullscreen');
    const cloneContext = canvas.getContext('2d');


    const loop = () => {
      cloneContext.drawImage(this.dom.video, 0, 0);
      requestAnimationFrame(loop);
    };

    loop();

    const transformOriginX = clone.getBoundingClientRect().left
      / document.documentElement.clientWidth * 100;
    const transformOriginY = clone.getBoundingClientRect().top
      / document.documentElement.clientHeight * 100;

    document.querySelector('body').style.overflow = 'hidden';

    clone.style.transformOrigin = `${transformOriginX}% ${transformOriginY}%`;

    // TODO: Сделать рассчет scale
    clone.style.transform = 'scale(4)';

    clone.addEventListener('click', () => {
      clone.style.transform = 'scale(1)';
    });
  }

  initVideo() {
    const { video } = this.dom;

    if (Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: false });
      hls.loadSource(this.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      this.hls = hls;

      hls.on(Hls.Events.LEVEL_SWITCHED, () => {
        const DEFAULT_ASPECT_RATIO = 1.75;
        const resolution = this.getVideoAspectRatio();

        if (resolution >= DEFAULT_ASPECT_RATIO) {
          this.dom.canvas.style.height = '100%';
        } else {
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

  getVideoAspectRatio() {
    this.currentLevel = this.hls.currentLevel === -1 ? 0 : this.hls.currentLevel;
    return this.hls.levels[this.currentLevel].width / this.hls.levels[this.currentLevel].height;
  }
}
