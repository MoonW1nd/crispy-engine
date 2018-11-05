import iFlux from 'blocks/_helpers/iFlux/index';
import AudioAnalyser from 'blocks/AudioAnalyser/AudioAnalyser';
import Button from 'blocks/Button/Button';
import RangeController from 'blocks/RangeController/RangeController';
import VideoPlayer from 'blocks/VideoPlayer/VideoPlayer';
import { IPayload } from '../../blocks/_helpers/iFlux/src/Dispatcher';
/* global document window */

interface IVideoPlayersList {
  [id: string]: VideoPlayer;
}

window.addEventListener('load', () => {
  const Dispatcher = new iFlux.Dispatcher();
  const Actions = new iFlux.Actions(Dispatcher);

  const initialStore = {
    videos: {
      id_0: {
        brightness: 0,
        contrast: 0,
      },
      id_1: {
        brightness: 0,
        contrast: 0,
      },
      id_2: {
        brightness: 0,
        contrast: 0,
      },
      id_3: {
        brightness: 0,
        contrast: 0,
      },
    },
  };

  const Store = iFlux.Store.createStore(initialStore, Dispatcher);
  Actions.create('CHANGE_BRIGHTNESS', null);
  Actions.create('CHANGE_CONTRAST', null);

  const storeActionHandlers = (payload: IPayload): void => {
    switch (payload.action) {
      case Actions.list.CHANGE_BRIGHTNESS: {
        const newStoreValue = Store.getStore();
        newStoreValue.videos[payload.data.playerId].brightness = payload.data.value;
        Store.updateStore(newStoreValue);
        break;
      }

      case Actions.list.CHANGE_CONTRAST: {
        const newStoreValue = Store.getStore();
        newStoreValue.videos[payload.data.playerId].contrast = payload.data.value;
        Store.updateStore(newStoreValue);
        break;
      }
    }
  };

  Store.registerActions(storeActionHandlers);

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

    const videoPlayer = videoPlayers[`id_${id}`].player;

    if (videoPlayer != null) {
      videoPlayer.addEventListener('click', () => {
        videoPlayers[`id_${id}`].openFullScreen();
      });
    }

    if (ButtonClose.view != null) {
      ButtonClose.view.addEventListener('click', () => {
        videoPlayers[`id_${id}`].closeFullScreen();
      });
    }

    const rangeInput = RangeControllerLight.dom.input;
    if (rangeInput != null) {
      rangeInput.addEventListener('input', () => {
        Actions.changeBrightness({ playerId: `id_${id}`, value: Number(rangeInput.value) });
      });
    }

    const contrastInput = RangeControllerContrast.dom.input;
    if (contrastInput != null) {
      contrastInput.addEventListener('input', () => {
        Actions.changeContrast({ playerId: `id_${id}`, value: Number(contrastInput.value) });
      });
    }

    Store.addListener(() => {
      const currentState = Store.getStore();
      const videoPlayerId = `id_${id}`;
      const brightness = currentState.videos[videoPlayerId].brightness;
      videoPlayers[videoPlayerId].brightnessChange(brightness);
    });
    Store.addListener(() => {
      const currentState = Store.getStore();
      const videoPlayerId = `id_${id}`;
      const contrast = currentState.videos[videoPlayerId].contrast;
      videoPlayers[videoPlayerId].contrastChange(contrast);
    });

    const videoPlayerInstance = videoPlayers[`id_${id}`];

    if (videoPlayerInstance.dom.video) {
      const analyser = new AudioAnalyser({
        parent: videoGrid,
        video: videoPlayerInstance.dom.video,
      });

      videoPlayerInstance.audioAnalyser = analyser;
      videoPlayerInstance.analyserFunction = () => {
        analyser.draw();
      };
    }
  });
});
