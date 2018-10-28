import AudioAnalyser from 'blocks/AudioAnalyser/AudioAnalyser';
import Button from 'blocks/Button/Button';
import RangeController from 'blocks/RangeController/RangeController';
import VideoPlayer from 'blocks/VideoPlayer/VideoPlayer';
/* global document window */

interface IVideoPlayersList {
  [id: string]: VideoPlayer;
}

window.addEventListener('load', () => {
  const videoGrid = document.querySelector<HTMLElement>('.PageContent-VideoGrid');
  const videoPlayers: IVideoPlayersList = {};
  const localIP = 'localhost';
  const videoLinks = [
    `http://${localIP}:9191/master?url=http%3A%2F%2F${localIP}%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8`,
    `http://${localIP}:9191/master?url=http%3A%2F%2F${localIP}%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8`,
    `http://${localIP}:9191/master?url=http%3A%2F%2F${localIP}%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8`,
    `http://${localIP}:9191/master?url=http%3A%2F%2F${localIP}%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8`,
  ];

  if (videoGrid == null) { throw Error('Не найдена сетка видео'); }
  const ButtonClose = new Button({
    content: 'все камеры',
    modifier: 'VideoGrid-ButtonClose',
    parent: videoGrid,
  });

  const ButtonPlay = new Button({
    content: 'вкл. видео',
    modifier: 'VideoGrid-ButtonPlay',
    parent: videoGrid,
  });

  const RangeControllerLight = new RangeController({
    modifier: 'VideoGrid-LightController',
    parent: videoGrid,
    rangeMax: 200,
    rangeMin: -200,
  });

  const RangeControllerContrast = new RangeController({
    modifier: 'VideoGrid-ContrastController',
    parent: videoGrid,
    rangeMax: 100,
    rangeMin: 0,
    type: 'contrast',
  });

  videoLinks.forEach((url, id) => {
    videoPlayers[`id_${id}`] = new VideoPlayer({
      button: ButtonClose,
      buttonPlay: ButtonPlay,
      contrastController: RangeControllerContrast,
      lightController: RangeControllerLight,
      parent: videoGrid,
      url,
    });

    videoPlayers[`id_${id}`].player.addEventListener('click', () => {
      videoPlayers[`id_${id}`].openFullScreen();
    });

    if (ButtonClose.view != null) {
      ButtonClose.view.addEventListener('click', () => {
        videoPlayers[`id_${id}`].closeFullScreen();
      });
    }

    RangeControllerLight.dom.input.addEventListener('input', () => {
      videoPlayers[`id_${id}`].brightnessChange(RangeControllerLight.dom.input.value);
    });

    RangeControllerContrast.dom.input.addEventListener('input', () => {
      videoPlayers[`id_${id}`].contrastChange(RangeControllerContrast.dom.input.value);
    });

    const analyser = new AudioAnalyser({
      parent: videoGrid,
      video: videoPlayers[`id_${id}`].dom.video,
    });

    videoPlayers[`id_${id}`].audioAnalyser = analyser;
    videoPlayers[`id_${id}`].analyserFunction = () => {
      analyser.draw(analyser.data);
    };
  });
});
