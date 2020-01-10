const app = require('../server');
const PORT = require('../server').port;
let expect  = require('chai').expect;
let request = require('request');

describe('server', function () {
    after(function () {
      require('../server').close();
    });

    it('Main page content', function(done) {
        request('http://localhost:' + PORT , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});

