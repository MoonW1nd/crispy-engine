import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';
import { ICardData } from '../../src/blocks/Card/Card';

const readFileAsync = promisify(fs.readFile);

function isCorrectNumberParam(parameter: string) {
  if (typeof parameter === 'string' && parameter.length > 0) {
    const intNumber = parseInt(parameter, 10);
    if (!Number.isNaN(intNumber)) { return true; }
  }
  return false;
}

exports.events = (req: Request, res: Response, next: NextFunction) => {
  let resultData;
  let amount;
  let page;

  readFileAsync(path.join(__dirname, '../data/events.json'), { encoding: 'utf8' })
    .then((data: string) => {
      const { events } = JSON.parse(data);
      switch (true) {
        case 'type' in req.body:
          resultData = events.filter((event: ICardData ) => event.type && event.type === req.body.type);
          if (resultData.length > 0) {
            res.json(resultData);
          } else {
            res.status(400).send('incorrect type');
          }
          break;

        case 'amount' in req.body && 'page' in req.body:
          ({ amount, page } = req.body);
          if (!isCorrectNumberParam(amount)) { res.status(400).send('incorrect amount'); }
          if (!isCorrectNumberParam(page)) { res.status(400).send('incorrect page'); }

          amount = parseInt(amount, 10);
          page = parseInt(page, 10);

          resultData = events.slice(amount * page, amount * (page + 1));

          res.json(resultData);
          break;

        case 'amount' in req.body:
          ({ amount } = req.body);
          if (!isCorrectNumberParam(amount)) { res.status(400).send('incorrect amount'); }
          amount = parseInt(amount, 10);

          resultData = events.slice(0, amount);

          res.json(resultData);
          break;

        default:
          res.json(events);
      }
    })
    .catch((err: Error) => next(err));
};
