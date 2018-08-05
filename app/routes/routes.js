const movieSchema = require('./validation/movies/schema.js');
const commentSchema = require('./validation/comments/schema.js');
const Joi = require('joi');
const request = require('request-promise');
const path = require('path');

const apiaddress = process.env.OMDB_APIADDRESS;
const apikey = process.env.OMDB_APIKEYSTRING
const dbURL = process.env.MONGODB_URI;

module.exports = function(app, db) {
   
    /*
    *   GET index - info about api
    */ 
    app.get('/', (req, res) => {
        res.status(202).sendFile(path.join(__dirname, '../interface/index.html'));
    });
    /*
    *   POST /movies - fetches info from omdb api and saves to db
    */     
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
                db.collection("movies").findOne(
                        {
                            $or: [{
                                _id: moviestring.toLowerCase()
                            },{
                                _id: new RegExp(moviestring, 'gi')
                            }]
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
                        let responseinfo = JSON.parse(data);
                        if(responseinfo["Response"] == "False") {
                            // movie wasn't found in database
                            res.status(404).send();
                            console.log("Movie not Found!");
                        }else{

                            // helper function from babel
                            function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

                            var movie = {
                                _id : responseinfo["Title"],
                                data : _objectWithoutProperties(responseinfo, ["Title"])
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

    // fetches list of all movies already present in app database
    app.get('/movies/:sort', (req, res) => {
        // BONUS: add additional filtering
        // :sort can have values: byyear || bycountry || byrating  || byboxoffice
        movieSchema.getSchema.validate(req.body.params, {abortEarly: false})
        .then(validRequest => {
            const sort = req.body.params;
            
            return sort;
        }).catch(validationError => {
            res.status(400).send(validationError.details);
        }).then(sort => {
            switch(sort){
                case 'byyear':
                    sort = "Year";
                    break;
                case 'bycountry':
                    sort = "Country";
                    break;
                case 'byrating':
                    sort = "Ratings";
                    break;
                case 'byboxoffice':
                    sort = "BoxOffice"
                    break;
            }
            db.collection("movies").find({}).sort({ [sort]: 1 }).toArray( (err, result) => {
                if(err){
                    res.status(404).send();
                }
                res.status(202).send(result);
            });
            

        })
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
        let obj = {
            title : req.params.movie.replace(/\+/g, ' ')
        }
        console.log(obj)
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