# Домашнее задание

## "Адаптивная верстка"
Нужно сверстать страницу ленты событий умного дома.
Предоставляется базовый дизайн ленты для экрана. Изменения размеров и компоновки карточек на других размерах экрана необходимо придумать и реализовать самостоятельно. Верстка должна быть максимально адаптивной.


На что обратить внимание:
- [x] Необходимо адаптировать вёрстку для экранов размером от 320px до 1920px по ширине, т.е. для смартфонов, планшетов, ноутбуков и широкоформатных мониторов: Так как на макетах были размеры экранов 370px, 1370px c размерами шрифтов, поэтому для адаптивных размеров использовались именно эти размеры. Но сайт хорошо смотрится и на крайних значениях указанных в задании.
- [ ] Мы уважаем авторские права, поэтому просьба в подвале также дать ссылку на лицензию
- [x] Заголовки могут состоять из не более, чем двух строк, остальное обрезается многоточием: написал функцию `getTruncateHandler() - которая возвращает функцию для обработчика ресайза.`

Типы карточек:
- [x] Карточки бывают трех размеров. Большая, средняя и маленькая. На десктопе большая занимает 4 колонки, средняя — 3, маленькая — 2.
Таким образом в одном ряду (на десктопе) могут уместиться: большая + маленькая (или маленькие друг под другом), 2 средних или 3 маленьких.
- [x] У карточек событий есть разные типы: обычное событие и критичное (важное). На макетах критичные отмечены красной шапкой.
Также у карточек бывают разные форматы. Это может быть просто карточка с иконкой, заголовком и метаданными (есть у всех), дополнительно могут присутствовать описание и различные специфичные для этой карточки контролы/данные. График рисовать не обязательно, можно заменить картинкой/svg.

- [x] Предполагается, что если по соседству стоят карточки разного размера, более "короткая" вытягивается в высоту. При растягивании карточек иконка, заголовок, источник (напр. "Пылесос") и время прибиваются к верху, описание и данные к низу: сделал так что текст пояснения прибиваются к низу вместе с данными.

На более высокую оценку:
 - [x] Адаптивная типографика - использовал для адаптивной типографики формулу calc(minFontSize + (maxFontSize - minFontSize) * (100vw - minScreenSize) / (maxScreenSize-minScreenSize))
 - [x] Адаптивные изображения - везде где возможно использовал svg, где нет - использовал `img` c атрибутом `srcset`.
 - [ ] Вариативные шрифты (не хватило времени)
 - [x] Отрисовка ленты с помощью шаблонизатора, т.е. генерация HTML из предоставленного набора данных в формате JSON . Приветствуется самостоятельная реализация простого шаблонизатора (например, на базе <template>-тега): создал функцию render (src/blocks/Card/Card.js). Которая использует `<template/>` для формирования и добавления на сайт, карточки ивентов на сайт.
 - [x] Не забываем добавлять тег, запрещающий индексацию страницы: `<meta name="robots" content="noindex">`

Проверка корректности верстки в браузерах:
  - [x] Chrome
  - [ ] Edge
  - [ ] Firefox
  - [ ] Safari
  - [ ] Яндекс.Браузер

## "Работа с сенсорным пользовательским вводом"
Задание:
- [x] Движение вправо-влево позволяет перемещаться по картинке: поворот камеры
- [x] Pinch позволяет приблизить и отдалить изображение
- [x] Поворот изменяет яркость изображения
- [ ] Обзор на 360 с помощью Pointer Lock API

Реализация жестов лежит: `src/blocks/_helpers/_events.js`