import VideoPlayer from 'blocks/VideoPlayer/VideoPlayer';
import Button from 'blocks/Button/Button';
import RangeController from 'blocks/RangeController/RangeController';
import AudioAnalyser from 'blocks/AudioAnalyser/AudioAnalyser';

/* global document window */

window.addEventListener('load', () => {
  const videoGrid = document.querySelector('.PageContent-VideoGrid');
  const videoPlayers = {};
  const localIP = 'localhost';
  const videoLinks = [
    `http://${localIP}:9191/master?url=http%3A%2F%2F${localIP}%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8`,
    `http://${localIP}:9191/master?url=http%3A%2F%2F${localIP}%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8`,
    `http://${localIP}:9191/master?url=http%3A%2F%2F${localIP}%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8`,
    `http://${localIP}:9191/master?url=http%3A%2F%2F${localIP}%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8`,
  ];

  const ButtonClose = new Button({
    content: 'все камеры',
    parent: videoGrid,
    modifier: 'VideoGrid-ButtonClose',
  });

  const ButtonPlay = new Button({
    content: 'вкл. видео',
    parent: videoGrid,
    modifier: 'VideoGrid-ButtonPlay',
  });


  const RangeControllerLight = new RangeController({
    parent: videoGrid,
    modifier: 'VideoGrid-LightController',
    rangeMin: -200,
    rangeMax: 200,
  });

  const RangeControllerContrast = new RangeController({
    parent: videoGrid,
    modifier: 'VideoGrid-ContrastController',
    type: 'contrast',
    rangeMin: 0,
    rangeMax: 100,
  });

  videoLinks.forEach((url, id) => {
    videoPlayers[`id_${id}`] = new VideoPlayer({
      parent: videoGrid,
      url,
      button: ButtonClose,
      buttonPlay: ButtonPlay,
      lightController: RangeControllerLight,
      contrastController: RangeControllerContrast,
    });

    videoPlayers[`id_${id}`].player.addEventListener('click', () => {
      videoPlayers[`id_${id}`].openFullScreen();
    });

    ButtonClose.view.addEventListener('click', () => {
      videoPlayers[`id_${id}`].closeFullScreen();
    });

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
