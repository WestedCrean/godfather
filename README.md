# 🌹 godfather - Node.js REST API for movies database

Installation: 
```
    git clone https://github.com/WestedCrean/godfather.git
    npm install
```
, then save environment variables to .env file
``` 
    OMDB_APIKEYSTRING=&apikey=<your-api-key>
    MONGODB_URI=<your-mongodb-uri>
```
and run your server locally
```
    npm start
```

I recommend Postman for making api requests but in /test/test.js you can play around with mocha/chai tests:
```
    npm test
```

# 🎯 Endpoints
App has 4 endpoints:

1. ``` POST /movies ```

Given a request with movie title in body, fetches info about it from OMDB API and saves it to database

2. ``` GET /movies/:sortby(optional) ```

Returns all movies from database, optionally with sorting

Sorting:
    As last parameter pass one of these values: byyear|bycountry|byrating|byboxoffice
    Ex: /movies/bycountry

``` GET /movies/filter/:filter/:sortby(optional) ```

More sophisticated version of endpoint above, returns filtered movies from database 
    as :filter parameter pass 'key=value' pair

Ex: /movies/filter/country=usa , /movies/filter/year=2006/byboxoffice

Although any field can be filtered, but due to the nature of OMDB movie info, I recommend using only these fields:

Filters:
    country | year | language | boxoffice

Currently filtering allows only for exact match!

3. ``` POST /comments ```

Given a request with 'title' and 'comment' fields, posts a comment to database

4. ``` GET /comments/:movie(optional) ```

Returns all comments about movie passed as parameter (and all movies by default)

# 🛠 Libraries and frameworks used

App is based on Node with Express.js and MongoDB as database

Joi - request validation
``` 
getSchema: Joi.object().keys({
        sort: Joi.string().trim().regex(/byyear|bycountry|byrating|byboxoffice/gm)})

```
Request-promise - for Promise-based requests to OMDB API - Request module normally uses callbacks but promises are a much better solution for rest api and processing fetched data.

```
request(url).then( data => {
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
Chai and Mocha - testing
