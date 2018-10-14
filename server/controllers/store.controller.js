const data = require('../data/events.json');

function isCorrectNumberParam(parameter) {
  if (typeof parameter === 'string' && parameter.length > 0) {
    const intNumber = parseInt(parameter, 10);
    if (!Number.isNaN(intNumber)) return true;
  }
  return false;
}

exports.events = (req, res) => {
  let resultData;
  let amount;
  let page;

  switch (true) {
    case 'type' in req.query:
      resultData = data.events.filter(event => event.type && event.type === req.query.type);
      res.setHeader('Content-Type', 'application/json');
      if (resultData.length > 0) {
        res.json(resultData);
      } else {
        res.status(400).send('incorrect type');
      }
      break;

    case 'amount' in req.query && 'page' in req.query:
      ({ amount, page } = req.query);
      if (!isCorrectNumberParam(amount)) res.status(400).send('incorrect amount');
      if (!isCorrectNumberParam(page)) res.status(400).send('incorrect page');

      amount = parseInt(amount, 10);
      page = parseInt(page, 10);

      resultData = data.events.slice(amount * page, amount * (page + 1));

      res.json(resultData);
      break;

    case 'amount' in req.query:
      ({ amount } = req.query);
      if (!isCorrectNumberParam(amount)) res.status(400).send('incorrect amount');
      amount = parseInt(amount, 10);

      resultData = data.events.slice(0, amount);

      res.json(resultData);
      break;

    default:
      res.json(data);
  }
};
