const movieSchema = require('./validation/movies/schema.js');
const commentSchema = require('./validation/comments/schema.js');
const Joi = require('joi');
module.exports = function(app, db) {
    
    // fetches more info for a given movie, and saves it into app database
    app.post('/movies', (req, res) => {
        console.log("POST request body : " + req.body.title)
        movieSchema.postMovies.validate(req.body, {abortEarly: false})
            .then(validRequest => {
                console.log("Valid request!")

                res.status(200).send();
            })
            .catch(validationError => {
                console.log("Invalid request!")

                const err = validationError.details.map(d => d.message);
                res.status(400).send(err);
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