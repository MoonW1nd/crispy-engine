const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.use((req, res) => {
  res.status(404).send('<h1>Page not found</h1>');
});

app.set('view engine', 'html');

if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);

app.listen(port, () => console.log(`App listening on port ${port}!`));
