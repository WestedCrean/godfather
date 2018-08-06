process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
//const app = require('../server');
const should = require('chai').should();

const movieSchema = require('../app/routes/model/movies/schema.js');
const commentSchema = require('../app/routes/model/comments/schema.js');

chai.use(chaiHttp);

//const host = "http://desolate-sands-44727.herokuapp.com";
const host = "http://localhost:8081"

var movienotindb = "Skyfall"; // you have to change this every time you run test to a movie not in db
                                // app don't have a method for deleting movies and code shouldn't be changed for testing
var wrongMovie = "tqwe";

describe('/GET movies', () => {
    it('should GET all movies from app database', (done) => {
      chai.request(host)
          .get('/movies')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
    });
});

describe('/POST comments', () => {
    it('should POST a new comment to a movie which exists in db', (done) => {
      chai.request(host)
          .post('/comments')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({title: "Moonlight", comment: "10/10!"})
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            done();
          });
    });

    it("should fail to POST a new comment to a movie which doesn't exists in db", (done) => {
        chai.request(host)
            .post('/comments')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({title: wrongMovie, comment: "10/10!"})
            .end((err, res) => {
              res.should.have.status(400);
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
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.keys(['_id', 'data']);
            done();
          });
    });

    it('should fetch data about a movie from app database', (done) => {
        chai.request(host)
            .post('/movies')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({title: 'La la land'})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.keys(['_id', 'data']);
              done();
            });
      });

      it('should try to fetch data about a movie with invalid title', (done) => {
        chai.request(host)
            .post('/movies')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({title: wrongMovie})
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              done();
            });
      });
});

describe('/GET comments', () => {
    it('should GET all comments from database', (done) => {
      chai.request(host)
          .get('/comments')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
    });
});
