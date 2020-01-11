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
        request(URL + '/test', async function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.not.equal('null');
            const json = JSON.parse(body);
            expect(json.def).to.equal("definition");
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

    it('Delete Route', function(done) {
        request(URL + '/delete/foo', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            const json = JSON.parse(body);
            expect(json.deletedCount).to.equal(0);
            done();
        });
    });
});

