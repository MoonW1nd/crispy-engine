const express = require('express');
const routes = require('./routes/routes');

const app = express();
const port = 8000;

app.use('/', routes);

app.use((req, res) => {
  res.status(404).send('<h1>Page not found</h1>');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
