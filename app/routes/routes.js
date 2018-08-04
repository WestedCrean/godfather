const movieSchema = require('./validation/movies/schema.js');
const commentSchema = require('./validation/comments/schema.js');
const Joi = require('joi');
const request = require('request-promise');
const omdb = require('../../config/omdb.js');

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
                moviestring = moviestring.replace(/\s/g, '+');
                //omdb api call
                var url = omdb.OMDB_APIADDRESS + '?t=' + moviestring + omdb.OMDB_APIKEYSTRING;
                console.log("GET " + url);
                request(url).then( (data) => {
                        var movie = {
                            title : moviestring,
                            data : data
                        }
                        res.status(202).send(movie)
                        return data
                })
                .then( data => {
                    //save data to database
                    console.log("saving data...")
                    }
                );
            })
    });
    // fetches list of all movies already present in app database
    app.get('/movies', (req, res) => {
        var dbNotEmpty = True;
        if(dbNotEmpty){
            res.send("Hello!");
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