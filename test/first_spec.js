process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

var mongoose = require("mongoose");

var server = require('../app');

var Todo = require("../models/user");

var assert = require("assert");




chai.use(chaiHttp);

//const apiRoot = 'http://localhost:3000';
const apiRoot = require('../app');

describe('SAN ROQUE APP', function(){


	describe('POST /users/authenticate', function(){
		it(
			'it should return status = 200',
			function(done){
				chai.request(apiRoot)
				.post('/users/authenticate')
				.send({
					"email":"jrhod_baby@yahoo.com",
					"password": "password"
				})
		    	.end(function(err,res){
		    		res.should.have.status(200);
		   			done();
	   			});
			}
		);

		it(
			'it should return response with success property = true',
			function(done){
				chai.request(apiRoot)
				.post('/users/authenticate')
				.send({
					"email":"jrhod_baby@yahoo.com",
					"password": "password"
				})
		    	.end(function(err,res){
		    		res.should.have.status(200);
		    		res.body.should.have.property('success').eql(true);
		    		//console.log(res.body);
		   			done();
	   			});
			}
		);

		it(
			'it should return response with token property',
			function(done){
				chai.request(apiRoot)
				.post('/users/authenticate')
				.send({
					"email":"jrhod_baby@yahoo.com",
					"password": "password"
				})
		    	.end(function(err,res){
		    		res.body.should.have.property('token');
		    		//console.log(res.body);
		   			done();
	   			});
			}
		);
	});


});

/*
describe("Registering new user for the App", function() {
	describe("POST /users/register", function() {
	
		it(
			"Is valid", 
			function() {
				assert(true);
			}
		);		

	});
});
*/

/*
describe("Registering new user for the App", function() {
	describe("POST /users/register", function() {
		let token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQzMjhiZTU5YjYxMDNjNjI0OWVlYTYiLCJmaXJzdG5hbWUiOiJKZXJpYyIsImxhc3RuYW1lIjoiVGliYXlhbiIsImVtYWlsIjoianJob2RfYmFieUB5YWhvby5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRsYUR5WGFWYWZxWExXeG1TUXg0R1N1SlRjVkdQRVZiazNUdzRKWG0vU3k0aEEvRU9XTHZhQyIsInJvbGUiOiJhZG1pbiIsIl9fdiI6MCwiaWF0IjoxNjA5OTQxMzE3fQ.E50BZuwdiLyy8DQJz6yRQCqUqWjdLHmkc98NRPrnrMA';
		it(
			
			"Should login user and return success, msg, token, and the user object", 
			(done) => {
				chai.request('http://localhost:3000')
				.post('/users/register')
				.type('form')
				.set({ Authorization: `Bearer '${token}'` })
				.send({
					"name":"Jeric Tibayan2",
					"email":"jrhod_baby21@yahoo.com",
					"username":"jrtib2",
					"password": "password2",
				    "role": "cashier"
				})
				.end((err, res) => {
					res.should.have.status(201);

					//if(err) return done(err);


					console.log(res);

					done();
				});
			}
		);		

	});
});

*/