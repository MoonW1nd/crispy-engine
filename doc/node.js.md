# Домашняя работа по теме Node.js
## **Запуск**
1. Клонировать репозиторий

```
git clone https://github.com/MoonW1nd/crispy-engine.git
```

2. Переключится на ветку node.js-homework

```
git checkout node.js-homework
```

3. Установить зависимости

```
npm install
```

4. Запуск сервера
> разрабатывалось на версии Node.js v9.8.0
```
nodemon ./server/index.js
```
> для локальной работы nodemon возможно потребуется прописать в консоли `export PATH=./node_modules/.bin:$PATH`

или

```
node ./server/index.js
```

Сайт должен открыться на 8000 порту: http://localhost:8000/

## **Файловая структура:**

```
  src/
  |__ controllers/                       //контроллеры
  |   |__ controllerName.controller.js
  |    ...
  |__ data/                             // все нужные данные (events.json)
  |   ...
  |
  |__ handlers/                 // файл с разметкой для типовой страницы
  |   ...
  |
  |__ routes/                   // папка в которой содержатся файлы частей шаблона: шапки и подвала
  |   ...
  |
  |__ index.js                  // навешивание всех обработчиков событий компонентов
  ...
```

## **Выполненные задания**
Написать сервер на express который будет подниматься на 8000 порту и обрабатывать два роута:
- [x] /status — должен выдавать время, прошедшее с запуска сервера в формате hh:mm:ss (http://localhost:8000/status)
- [x] /api/events — должен отдавать содержимое файла events.json (доступ через POST запросы)
- [x] При передаче get-параметра type включается фильтрация по типам событий.
- [x] При передаче некорректного type — отдавать статус 400 "incorrect type". (/api/events?type=info:critical)
- [x] Все остальные роуты должны отдавать `<h1>Page not found</h1>`, с корректным статусом 404. (http://localhost:8000/shri)

**Со звездочкой**
- [x] Перейти на POST-параметры.
- [x] Сделать пагинацию событий — придумать и реализовать API, позволяющее выводить события постранично.

**Дополнительно**
 - Добавил обработку ошибок для production и development режимов
 - В production режиме при ошибке отдается простенькая страничка "Упс что-то пошло не так..."

### Описание придуманного API
 Запрос имеет следующие параметры:
 - amount - количество записей
 - page - номер страницы

Особенности работы:
- При запросе amount без page возвращает заданное количество записей;
- При запросе page без amount возвращается 400-ка c "incorrect page" - так-как это не корректный запрос без информации о количестве записей на странице.

### Тестирование API из консоли

Интерфейс:

```
curl --data "parameters" http://localhost:8000/api/events
```

Примеры:
```
curl --data "type=info" http://localhost:8000/api/events
curl --data "type=critical" http://localhost:8000/api/events
curl --data "type=info:critical" http://localhost:8000/api/events
curl --data "amount=2&page=2" http://localhost:8000/api/events
```




