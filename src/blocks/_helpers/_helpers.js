/* global document */

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
