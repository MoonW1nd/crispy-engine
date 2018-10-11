/* global requestAnimationFrame Hls isNaN document */
import { getTemplateContent } from '../_helpers/_helpers';

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
