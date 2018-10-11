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

  toggleFullScreen() {
    const clone = document.importNode(this.player, true);
    clone.classList.add('VideoPlayer-Clone');
    this.parent.parentNode.appendChild(clone);

    const playerBox = getBox(this.player);

    clone.style.width = `${playerBox.width}px`;
    clone.style.height = `${playerBox.height}px`;
    clone.style.left = `${playerBox.left}px`;
    clone.style.top = `${playerBox.top}px`;

    const canvas = clone.querySelector('.VideoPlayer-Canvas');
    canvas.style.left = clone.style.left;
    canvas.style.top = clone.style.top;
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
    clone.style.transform = 'scale(10)';
  }

  initVideo() {
    const { video } = this.dom;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }
}
