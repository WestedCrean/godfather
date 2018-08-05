# 🌹 godfather

Node.js REST API for movies database

Installation:

Clone repository, run 
```
    npm install
```
 fill in environment variables to .env file
``` 
    OMDB_APIKEYSTRING=&apikey=<your-api-key>
    MONGODB_URI=<your-mongodb-uri>
```
and run
```
    npm start
```

I recommend Postman for checking how API works

# 🎯 Endpoints
App has 4 endpoints:

1. ``` POST /movies ```

Given a request with movie title in body, fetches info about it from OMDB API and saves it to database

2. ``` GET /movies/:sortby(optional) ```

Returns all movies from database, optionally with sorting

Sorting:
    As last parameter pass one of these values: byyear|bycountry|byrating|byboxoffice

``` GET /movies/f/:filter ```

Returns filtered movies from database - as :filter parameter pass 'key=value' pair,  GET/movies/country=usa
Possible filters: country=<country>

3. ``` POST /comments ```

Given a request with 'title' and 'comment' fields, posts a comment to database

4. ``` GET /comments/:movie(optional) ```

Returns all comments about movie passed as parameter (and all movies by default)

# 🛠 Libraries and frameworks used

App is based on Node with Express.js and MongoDB as database


Joi - for request validation
``` 
getSchema: Joi.object().keys({
        sort: Joi.string().trim().regex(/byyear|bycountry|byrating|byboxoffice/gm)})

```
Request-promise - for Promise-based requests to OMDB API - Request module normally uses callbacks but promises work much better for rest api and processing fetched data.

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

