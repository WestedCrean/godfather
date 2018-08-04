const movieSchema = require('./validation/movies/schema.js');
const commentSchema = require('./validation/comments/schema.js');
const Joi = require('joi');
const request = require('request-promise');

const apiaddress = process.env.OMDB_APIADDRESS;
const apikey = process.env.OMDB_APIKEYSTRING
module.exports = function(app, db) {
    
    // fetches more info for a given movie, and saves it into app database
    app.post('/movies', (req, res) => {
        const dbURL = process.env.MONGODB_URI;
        console.log("mongodb: " + dbURL);
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
                //check if movie is in db
                //var o_id = new ObjectId(moviestring.toLowerCase())
                db.collection("movies").findOne(
                        {
                            _id: moviestring.toLowerCase()
                        }
                ).then( doc => {
                    if(doc){
                    console.log("found in db!");
                    res.status(202).send(doc);
                    } else {
                    //not found in db, call external API
                    console.log("Didn't found in db! : ");
                    moviestring = moviestring.replace(/\s/g, '+');
                    //omdb api call
                    var url = apiaddress + '?t=' + moviestring + apikey;
                    console.log("GET " + url);
                    request(url).then( (data) => {
                            var movie = {
                                _id : moviestring.replace(/\+/g, ' ').toLowerCase(),
                                data : data
                            }
                            return movie
                    }).then( movie => {
                        //save to db
                        db.collection('movies').insert(movie, (err, res) => {
                            if (err){
                                console.log("adding movie to database failed")
                                console.log(err)
                            } else {
                                console.log("adding movie to database success")
                            }
                        });
                        res.status(200).send(movie);

                    })
                    }
                }).catch( rejection => {
                    console.log("rejection");
                }
                );
            });              
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