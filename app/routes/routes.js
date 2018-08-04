const movieSchema = require('./validation/movies/schema.js');
const commentSchema = require('./validation/comments/schema.js');
const Joi = require('joi');
const request = require('request-promise');

const apiaddress = process.env.OMDB_APIADDRESS;
const apikey = process.env.OMDB_APIKEYSTRING
const dbURL = process.env.MONGODB_URI;

module.exports = function(app, db) {
    
    app.get('/', (req, res) => {
        res.status(202).send("Welcome to my API!");
    });
    // fetches more info for a given movie, and saves it into app database
    app.post('/movies', (req, res) => {
        console.log("POST request body : " + req.body.title)
        movieSchema.postSchema.validate(req.body, {abortEarly: false})
            .then(validRequest => {
                const moviestring = req.body.title;
                return moviestring;
            }).catch(validationError => {
                res.status(400).send(validationError.details);
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
                        if(data.response == "False") {
                            // movie wasn't found in database
                            res.status(404).send();
                            console.log("Movie not Found!");
                        }else{
                            var movie = {
                                _id : moviestring.replace(/\+/g, ' ').toLowerCase(),
                                data : JSON.parse(data)
                            }
                            return movie;
                        }
                    }).then( movie => {
                        //save to db
                        db.collection('movies').save(movie, (err, res) => {
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
        // BONUS: add additional filtering
        db.collection("movies").find({}).toArray( (err, result) => {
            if(err){
                res.status(404).send();
            }
            res.status(202).send(result);
        });
    });

    /*  
    *   POST /comments  -  saves comment to database and returns it, 
    *                      body should contain movie already present in db and comment text
    *  */
    app.post('/comments', (req, res) => {

        commentSchema.postSchema.validate(req.body, {abortEarly: false})
        .then(validRequest => {
            let commentRecord = {
                title : req.body.title,
                comment : req.body.comment
            }
            return commentRecord;
        }).catch(validationError => {
            res.status(400).send(validationError.details);
        }).then( commentRecord => {
            db.collection("movies").findOne({
                _id: commentRecord.title.toLowerCase()
            }).then( movie => {
                if(movie){
                    
                    //add comment to db
                    db.collection("comments").insert(commentRecord
                        , (err, result) => {
                            if (err){
                                console.log("adding comment to database failed")
                                console.log(err)
                                res.status(404).send();
                            } else {
                                console.log("adding comment to database success")
                                res.status(202).send(commentRecord);
                            }
                        });
                } else {
                    res.status(400).send();
                }
            })
        })

    });
    /*
    *   GET /comments - get all comments
    */ 
    app.get('/comments', (req, res) => {
        db.collection("comments").find({}).toArray( (err, result) => {
            if(err){
                res.status(404).send();
            }
            res.status(202).send(result);
        });
    });
    /*
    *   GET /comments - get comments with filtering
    */ 
    app.get('/comments/:movie', (req, res) => {
        console.log("comments with filtering!");
        let obj = {
            title : req.params.movie
        }
        movieSchema.postSchema.validate(obj, {abortEarly: false})
        .then(validRequest => {
            console.log("valid comment request for title: " + obj.title);
            return obj;
        }).catch(validationError => {
            res.status(400).send(validationError.details);
        }).then(obj => {
            db.collection("comments").find({
                title: obj.title
            }).toArray( (err, result) => {
                if(err){
                    res.status(404).send();
                }
                console.log(result);
                res.status(202).send(result);
            });
        })
    });

};