process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = require('chai').should();

const movieSchema = require('../app/routes/model/movies/schema.js');
const commentSchema = require('../app/routes/model/comments/schema.js');

chai.use(chaiHttp);

const host = "http://desolate-sands-44727.herokuapp.com";

var movienotindb = "Logan";
var wrongMovie = "tqwe";

describe('/GET movies', () => {
    it('should GET all movies from local database', (done) => {
      chai.request(host)
          .get('/movies')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            //res.body.should.length.be.eql(0);
            done();
          });
    });
});

describe('/POST movies', () => {
    it('should fetch data about a movie from api', (done) => {
      chai.request(host)
          .post('/movies')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({title: movienotindb})
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('array');
            done();
          });
    });

    it('should fetch data about a movie from local database', (done) => {
        chai.request(host)
            .post('/movies')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({title: 'La la land'})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              done();
            });
      });
});
