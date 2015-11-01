var should = require('should');
var assert = require('assert');
var request = require('supertest');
var app = require('../app');

describe('Api', function() {
    it('should return something', function (done) {
        request('http://localhost')
            .get('/api')
            .send()
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                done();
            });
    });
});