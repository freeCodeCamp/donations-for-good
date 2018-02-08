const express = require('express');
const bodyParser = require('body-parser');

const config = require('../lib/config');
const api = require('./api');

const port = config.port || 8080;


const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(req.originalUrl)
  next();
})

app.use('/api', api);

app.listen(port, () => {
  console.log(`donate-api started on :${port}`);
});
