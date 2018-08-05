# 🌹 godfather

Node.js REST API for movies database

Installation:

Clone repository, run npm install and fill in environment variables:
``` 
    export OMDB_APIKEYSTRING=&apikey=<yourapikey>
    export MONGODB_URI=mongodb://heroku_k5rq766p:bilqv38cjjn2bnte8sgprift64@ds113402.mlab.com:13402/heroku_k5rq766p 
```

# 🎯 Endpoints
App has 4 endpoints:

``` POST /movies ```

Given a request with movie title in body, fetches info about it from OMDB API and saves it to database

``` GET /movies/:filter(optional)/:sortby(optional) ```

Returns all movies from database, optionally it can be called with parameters for filtering and/or sorting

Filtering:
    As parameter pass 'key=value', ex:  GET/movies/country=usa

Sorting:
    As last parameter pass one of values: byyear|bycountry|byrating|byboxoffice

``` POST /comments ```

Given a request with 'title' and 'comment' fields, posts a comment to database

``` GET /comments/:movie(optional) ```

Returns all comments about movie passed as parameter (and all movies by default)

# 🛠 Libraries and frameworks used

App is based on Node with Express.js and MongoDB as database


Joi - for request validation
``` getSchema: Joi.object().keys({
        sort: Joi.string().trim().regex(/byyear|bycountry|byrating|byboxoffice/gm)
    })
     ```
Request-promise - for Promise-based requests to OMDB API

```
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
                    }).
```

