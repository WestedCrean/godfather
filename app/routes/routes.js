const movieSchema = require('./validation/movies/schema.js');
const commentSchema = require('./validation/comments/schema.js');
const Joi = require('joi');
const request = require('request-promise');

const OMDB_APIADDRESS = 'http://www.omdbapi.com/';
const OMDB_APIKEYSTRING = '&apikey=ca4f39b1';

module.exports = function(app, db) {
    
    // fetches more info for a given movie, and saves it into app database
    app.post('/movies', (req, res) => {
        console.log("POST request body : " + req.body.title)
        movieSchema.postMovies.validate(req.body, {abortEarly: false})
            .then(validRequest => {
                console.log("Valid request!");
                
                const moviestring = req.body.title;
                console.log(moviestring);
                return moviestring;
            }).catch(validationError => {
                console.log("Invalid request!")

                //const err = validationError.details.map(d => d.message);
                res.status(400).send();
            })
            .then(moviestring => {
                moviestring = moviestring.replace(' ', '+');
                //omdb api call
                var url = OMDB_APIADDRESS + '?t=' + moviestring + OMDB_APIKEYSTRING;
                console.log("GET " + url);
                request(url).then( (data) => {
                        console.log(data);
                        res.status(202).send(data);

                });
            })
    });
    // fetches list of all movies already present in app database
    app.get('/movies', (req, res) => {
        var dbNotEmpty = True;
        if(dbNotEmpty){
            res.status(200).send();
            // + send info
        } else {
            res.status(404).send();
        }
    });
    // saves comment to database and returns it,
    // body should contain movie already present in db and comment text
    app.post('/comments', (req, res) => {

    });
    // get all comments
    app.get('/comments', (req, res) => {

    });
};