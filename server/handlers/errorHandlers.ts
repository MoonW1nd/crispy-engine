import { Request, Response } from 'express';

/*
  Делаем более удобны стек трейс для разработки
*/
interface IError {
  status?: number;
  name: string;
  message: string;
  stack?: string;
}

interface IErrorDetails {
  [id: string]: string | number | undefined;
  message: string;
  stackHighlighted: string;
  status: number | undefined;
}

exports.developmentErrors = (err: IError, req: Request, res: Response) => {
  const errorStack = err.stack || '';
  const errorDetails: IErrorDetails = {
    message: err.message,
    stackHighlighted: errorStack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
    status: err.status,
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
exports.productionErrors = (err: IError, req: Request, res: Response) => {
  res.status(err.status || 500);
  res.send(`
  <h1>Упс что-то пошло не так...</h1>
  <p>Ошибка:</br>
  ${err.message}
  </p>
  `);
};
