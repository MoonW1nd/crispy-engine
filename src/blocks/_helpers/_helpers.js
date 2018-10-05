/* global document */

export function getTemplateContent(templateClassName) {
  const template = document.getElementsByClassName(templateClassName)[0];
  return document.importNode(template.content, true);
}


export function getImageHtml(nameImage, extension, className, alt = null) {
  return `<img src="./assets/${nameImage}.${extension}" class="${className}" alt="${alt != null ? alt : nameImage}"/>`;
}
