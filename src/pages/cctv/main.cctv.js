import VideoPlayer from '../../blocks/VideoPlayer/VideoPlayer';
import Button from '../../blocks/Button/Button';
import RangeController from '../../blocks/RangeController/RangeController';

/* global document window */

window.addEventListener('load', () => {
  const videoGrid = document.querySelector('.PageContent-VideoGrid');
  const videoPlayers = {};
  const videoLinks = [
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8',
  ];

  const ButtonClose = new Button({
    content: 'все камеры',
    parent: videoGrid,
    modifier: 'VideoGrid-ButtonClose',
  });

  const RangeControllerLight = new RangeController({
    parent: videoGrid,
    modifier: 'VideoGrid-LightController',
  });

  const RangeControllerContrast = new RangeController({
    parent: videoGrid,
    modifier: 'VideoGrid-ContrastController',
    type: 'contrast',
  });

  videoLinks.forEach((url, id) => {
    videoPlayers[`id_${id}`] = new VideoPlayer({
      parent: videoGrid,
      url,
      button: ButtonClose,
      lightController: RangeControllerLight,
      contrastController: RangeControllerContrast,
    });

    videoPlayers[`id_${id}`].player.addEventListener('click', () => {
      videoPlayers[`id_${id}`].openFullScreen();
    });

    ButtonClose.view.addEventListener('click', () => {
      videoPlayers[`id_${id}`].closeFullScreen();
    });

    RangeControllerLight.dom.input.addEventListener('change', () => {
      videoPlayers[`id_${id}`].brightnessChange(RangeControllerLight.dom.input.value);
    });
  });
});
