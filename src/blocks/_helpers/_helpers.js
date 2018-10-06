/* global document window */
export function getTemplateContent(templateClassName) {
  const template = document.getElementsByClassName(templateClassName)[0];
  return document.importNode(template.content, true);
}


export function getImageHtml(nameImage, extension, className, alt = null) {
  if (extension === 'jpg' || extension === 'png') {
    return `<img src="./assets/${nameImage}.${extension}" class="${className}"
      srcset="
      ./assets/${nameImage}.${extension} 1x,
      ./assets/${nameImage}-x2.${extension} 2x,
      ./assets/${nameImage}-x3.${extension} 3x"
      alt="${alt != null ? alt : nameImage}"
      />`;
  }
  return `<img src="./assets/${nameImage}.${extension}" class="${className}" alt="${alt != null ? alt : nameImage}"/>`;
}


export function getTruncateHandler(element) {
  const text = element.innerHTML;
  const title = element;
  return () => {
    const clone = document.createElement('div');

    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';

    clone.style.width = `${title.clientWidth - 16}px`;
    clone.style.fontSize = window.getComputedStyle(title).fontSize;
    clone.innerHTML = 'test <br/> text';

    document.body.appendChild(clone);
    const targetHeight = clone.clientHeight;

    clone.innerHTML = text;

    let l = text.length - 1;
    for (; l >= 0 && clone.clientHeight > targetHeight; --l) { //eslint-disable-line
      clone.innerHTML = `${text.substring(0, l)}...`;
    }

    title.innerHTML = clone.innerHTML;
  };
}
