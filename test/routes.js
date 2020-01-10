const app = require('../server');
const PORT = require('../server').port;
const URL = 'http://localhost:' + PORT;
let expect  = require('chai').expect;
let request = require('request');

describe('server', function () {
    after(function () {
      require('../server').close();
    });

    it('Index', function(done) {
        request(URL, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('Catch-All Route', function(done) {
        request(URL + '/foo/bar', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('Known Definition Lookup', function(done) {
        request(URL + '/test', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.equal(`{"_id":"5e0a8098f41fa3b28177372e","word":"test","def":"test%20definition"}`);
            done();
        });
    });

    it('Unknown Definition Lookup', function(done) {
        request(URL + '/foo', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.equal('null');
            done();
        });
    });
});

