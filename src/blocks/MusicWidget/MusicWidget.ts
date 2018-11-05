/* global document */
import { getTemplateContent } from '../_helpers/_helpers';
import { ICardDataMusicPlayer } from '../Card/Card';

export default function renderMusicWidget(parent: Element, data: ICardDataMusicPlayer) {
  const templateContent = getTemplateContent('MusicWidgetTemplate');

  const albumImage = templateContent.querySelector('.MusicWidget-AlbumImage');
  const artist = templateContent.querySelector('.MusicWidget-TrackArtist');
  const trackName = templateContent.querySelector('.MusicWidget-TrackName');
  const trackDuration = templateContent.querySelector('.MusicWidget-TrackDuration');
  const volumeValue = templateContent.querySelector('.MusicWidget-VolumeValue');

  if (albumImage && artist && trackName && trackDuration && volumeValue) {
    albumImage.setAttribute('src', data.albumcover);
    artist.innerHTML = data.artist;
    trackName.innerHTML = data.track.name;
    trackDuration.innerHTML = data.track.length;
    volumeValue.innerHTML = String(data.volume);
  } else {
    throw Error('Не корректный шаблон для MusicWidget');
  }

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}
