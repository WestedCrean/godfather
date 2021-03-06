const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8081;
const dbURL = process.env.MONGODB_URI;

app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(dbURL, (err, database) => {
    if(err){
        console.log(err);
        return;
    }
    db = database.db('heroku_k5rq766p');
    require('./app/routes')(app, db);

    module.exports = app.listen(port , () => {
        console.log('Listening on port ' + port);
    });
})