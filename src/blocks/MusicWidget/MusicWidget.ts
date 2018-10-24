/* global document */
import { getTemplateContent } from '../_helpers/_helpers';

export default function renderMusicWidget(parent, data) {
  const templateContent = getTemplateContent('MusicWidgetTemplate');

  const albumImage = templateContent.querySelector('.MusicWidget-AlbumImage');
  const artist = templateContent.querySelector('.MusicWidget-TrackArtist');
  const trackName = templateContent.querySelector('.MusicWidget-TrackName');
  const trackDuration = templateContent.querySelector('.MusicWidget-TrackDuration');
  const volumeValue = templateContent.querySelector('.MusicWidget-VolumeValue');


  albumImage.setAttribute('src', data.albumcover);
  artist.innerHTML = data.artist;
  trackName.innerHTML = data.track.name;
  trackDuration.innerHTML = data.track.length;
  volumeValue.innerHTML = data.volume;

  const clone = document.importNode(templateContent, true);
  parent.appendChild(clone);
}
