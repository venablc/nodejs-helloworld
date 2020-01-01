//test script
var request = require('supertest');
var app = require('../server.js');
describe('GET /test/', function() {
 it('respond with hello world', function(done) {
 //navigate to test url and check the the response is "test ok"
 request(app).get('/test/').expect('test ok', done);
 });
});