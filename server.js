const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const Joi            = require('joi');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = 8000;

require('./app/routes')(app, {});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});