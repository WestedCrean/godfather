const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const dbURL = process.env.MONGODB_URI;
app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(dbURL, (err, database) => {
    if(err){
        console.log(err);
        return;
    }
    db = database.db("godfather");
    require('./app/routes')(app, db);

    app.listen(port , () => {
        console.log('Listening on port ' + port);
    });
})