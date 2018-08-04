const movieSchema = require('./validation/movies/schema.js');
const commentSchema = require('./validation/comments/schema.js');
const Joi = require('joi');
const request = require('request-promise');

const apiaddress = process.env.OMDB_APIADDRESS;
const apikey = process.env.OMDB_APIKEYSTRING
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
                console.log("apiaddr : " + apiaddress);
                var url = apiaddress + '?t=' + moviestring + apikey;
                console.log("GET " + url);
                request(url).then( (data) => {
                        var movie = {
                            title : moviestring,
                            data : data
                        }
                        return movie
                })
                .then( movie => {
                    //save data to database
                    db.collection('movies').insert(movie, (err, res) => {
                        if (err){
                            console.log("adding movie to database failed")
                            console.log(err)
                        } else {
                            console.log("addig movie to database success")
                            res.status(202).send(movie);
                        }
                    })
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