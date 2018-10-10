/* global requestAnimationFrame */

export default class FullScreenVideoPlayer {
  constructor(options) {
    this.view = options.player;
    this.videoArea = options.player.querySelector('.FullScreenVideoPlayer-VideoArea');
    this.setIntervalIndex = null;
  }

  openOnClick(value) {
    const video = value;
    video.addEventListener('click', () => {
      function launchFullscreen(element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }

      video.width = video.offsetWidth;
      video.width = video.offsetWidth;
      this.videoArea.height = video.offsetHeight;
      this.videoArea.height = video.offsetHeight;

      const ctxVideoArea = this.videoArea.getContext('2d');

      launchFullscreen(this.view);

      function loop() {
        ctxVideoArea.drawImage(video, 0, 0);
        requestAnimationFrame(loop);
      }
      loop();
    });
  }
}
