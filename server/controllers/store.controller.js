const data = require('../data/events.json');

exports.events = (req, res) => {
  if ('type' in req.query) {
    const result = data.events.filter(event => event.type && event.type === req.query.type);

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(400).send('incorrect type');
    }
  } else {
    res.json(data);
  }
};
