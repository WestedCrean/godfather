const express        = require('express');
const validate       = require('express-validation');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const Joi            = require('joi');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
// TODO: is extended version really needed? (probably not)
const port = 8000;
const OMDB_APIKEY = 'ca4f39b1';

require('./app/routes')(app, {});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});