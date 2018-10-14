/*
  Делаем более удобны стек трейс для разработки
*/
exports.developmentErrors = (err, req, res) => {
  const errorStack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: errorStack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
  };
  errorDetails.stackHighlighted = errorDetails.stackHighlighted.replace(/\sat\s/gi, '<hr/><br/>at ');
  let resultHtml = '';
  Object.keys(errorDetails).forEach((key) => {
    resultHtml += `<li>${key}: ${errorDetails[key]}</li>`;
  });
  res.status(err.status || 500);
  res.send(`<ul>${resultHtml}</ul>`);
};


/*
  Отсылаем страницу: "Упс что-то пошло не так..."
*/
exports.productionErrors = (err, req, res) => {
  res.status(err.status || 500);
  res.send(`
  <h1>Упс что-то пошло не так...</h1>
  <p>Ошибка:</br>
  ${err.message}
  </p>
  `);
};
