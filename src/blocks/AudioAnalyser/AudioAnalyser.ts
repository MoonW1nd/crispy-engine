/* global document window */
import { getTemplateContent } from 'blocks/_helpers/_helpers';

export default class AudioAnalyser {
  constructor(options) {
    this.className = options.className;
    this.parent = options.parent;
    this.visible = options.visible;
    this.modifier = options.modifier;
    this.video = options.video;
    this.width = options.width || 140;
    this.height = options.height || 80;
    this.data = [];

    this.id = typeof AudioAnalyser.id === 'number' && !Number.isNaN(AudioAnalyser.id)
      ? AudioAnalyser.id + 1
      : 0;

    AudioAnalyser.id = this.id;
    this.render();
    this.init();
  }

  render(parent = this.parent) {
    if (parent == null) {
      throw Error('Следует указать элемент куда следует поместить контроллер');
    }

    const templateContent = getTemplateContent('AudioAnalyserTemplate');
    const templateController = templateContent.querySelector('.AudioAnalyser');
    templateController.classList.add(`AudioAnalyser_id_${this.id}`);

    if (!this.visible) {
      templateController.classList.add('AudioAnalyser_hidden');
    }

    if (this.modifier) {
      templateController.classList.add(this.modifier);
    }

    const clone = document.importNode(templateContent, true);


    parent.appendChild(clone);
    this.view = parent.querySelector(`.AudioAnalyser_id_${this.id}`);

    // делаю переприсваивание для улучшения читаемости,
    // а так же в будущем может this.view != this.canvas
    this.canvas = this.view;

    this.canvasContext = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();
      this.audioContext = audioContext;
      this.node = this.audioContext.createScriptProcessor(2048, 1, 1);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.smoothingTimeConstant = 0.3;
      this.analyser.fftSize = 256;
      this.bands = new Uint8Array(this.analyser.frequencyBinCount);
    } else {
      console.warn('Ваш браузер не поддерживает Web Audio API'); //eslint-disable-line
    }

    this.video.addEventListener('canplay', () => {
      if (this.source == null) {
        this.source = this.audioContext.createMediaElementSource(this.video);
      }

      this.source.connect(this.analyser);
      this.analyser.connect(this.node);
      this.node.connect(this.audioContext.destination);
      this.source.connect(this.audioContext.destination);

      this.node.onaudioprocess = () => {
        this.analyser.getByteFrequencyData(this.bands);
        this.data = this.bands;
      };
    });

    return this;
  }

  draw(dataArray) {
    const WIDTH = this.width;
    const HEIGHT = this.height;
    const bufferLength = this.analyser.fftSize;

    this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

    this.canvasContext.lineWidth = 2;
    this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

    const barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      this.canvasContext.fillStyle = 'rgba(255, 217, 62, 1)';
      this.canvasContext.fillRect(x, HEIGHT - barHeight / 4, barWidth, barHeight / 4);

      x += barWidth + 1;
    }
  }

  show() {
    this.view.classList.remove('AudioAnalyser_hidden');
  }

  hide() {
    this.view.classList.add('AudioAnalyser_hidden');
  }
}
