/* global document window */
import { getTemplateContent } from 'blocks/_helpers/_helpers';

interface IWindow {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

export interface IAudioAnalyserOptions {
  className?: string;
  parent: HTMLElement;
  visible?: boolean;
  modifier?: string;
  video: HTMLVideoElement;
  width?: number;
  height?: number;
}

declare var window: IWindow;

export default class AudioAnalyser {
  public static id: number;
  public className: string;
  public parent: HTMLElement;
  public visible: boolean;
  public modifier: string;
  public video: HTMLVideoElement;
  public width: number;
  public height: number;
  public id: number;
  public view: HTMLCanvasElement | null;
  public canvas: HTMLCanvasElement | null;
  public canvasContext: CanvasRenderingContext2D | null;
  public audioContext: AudioContext | null;
  public node: ScriptProcessorNode | null;
  public analyser: AnalyserNode | null;
  public bands: Uint8Array | null;

  constructor(options: IAudioAnalyserOptions) {
    this.className = options.className ? options.className : '';
    this.parent = options.parent;
    this.visible = options.visible ? options.visible : true;
    this.modifier = options.modifier ? options.modifier : '';
    this.video = options.video;
    this.width = options.width || 140;
    this.height = options.height || 80;

    this.view = null;
    this.canvas = null;
    this.canvasContext = null;
    this.audioContext = null;
    this.node = null;
    this.analyser = null;
    this.bands = null;

    this.id = typeof AudioAnalyser.id === 'number' && !Number.isNaN(AudioAnalyser.id)
      ? AudioAnalyser.id + 1
      : 0;

    AudioAnalyser.id = this.id;
    this.render();
    this.init();
  }

  public render(parent = this.parent) {
    if (parent == null) {
      throw Error('Следует указать элемент куда следует поместить контроллер');
    }

    const templateContent = getTemplateContent('AudioAnalyserTemplate');
    const templateController = templateContent.querySelector('.AudioAnalyser');

    if (!templateController) { throw Error('Не корректный шаблон'); }
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
    if (this.canvas == null) {throw Error('Не найден холст для отрисовки'); }
    this.canvasContext = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  public init() {
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
      // 'Ваш браузер не поддерживает Web Audio API'
    }

    let source: MediaElementAudioSourceNode | null = null;
    this.video.addEventListener('canplay', () => {
      if (this.audioContext === null) { throw Error('AudioContext не найден'); }
      if (this.node === null) { throw Error('ScriptProcessor не определен'); }
      if (this.analyser === null) { throw Error('AudioAnalyser не определен'); }

      if (source == null) {
        source = this.audioContext.createMediaElementSource(this.video);
      }

      source.connect(this.analyser);
      this.analyser.connect(this.node);
      this.node.connect(this.audioContext.destination);
      source.connect(this.audioContext.destination);

      this.node.onaudioprocess = () => {
        if (this.analyser === null) { throw Error('AudioAnalyser не определен'); }

        if (this.bands != null) {
          this.analyser.getByteFrequencyData(this.bands);
        }
      };

    });

    return this;
  }

  public draw() {
    const WIDTH = this.width;
    const HEIGHT = this.height;
    const bufferLength = this.analyser ? this.analyser.fftSize : 0;

    if (this.bands == null) { throw Error('Данные из анализатора звука еще не получены'); }
    if (this.canvasContext == null) { throw Error('Данные для отрисовки еще не получены'); }

    this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

    this.canvasContext.lineWidth = 2;
    this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

    const barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = this.bands[i];

      this.canvasContext.fillStyle = 'rgba(255, 217, 62, 1)';
      this.canvasContext.fillRect(x, HEIGHT - barHeight / 4, barWidth, barHeight / 4);

      x += barWidth + 1;
    }
  }

  public show() {
    if (this.view) {
      this.view.classList.remove('AudioAnalyser_hidden');
    }
  }

  public hide() {
    if (this.view) {
      this.view.classList.add('AudioAnalyser_hidden');
    }
  }
}
