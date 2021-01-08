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

		// since database empty I added a feature to add a default admin user by logging in using the following credentials
		//		email: admin
		//		password: password

		it(
			'it should not allow log in when database is empty',
			function(done){
				chai.request(apiRoot)
				.post('/users/authenticate')
				.send({
					"email":"jerictibayan@yahoo.com",
					"password": "jericpassword"
				})
		    	.end(function(err,res){
		    		res.should.have.status(200);
		    		res.body.should.have.property('success').eql(false);
		    		res.body.should.have.property('msg');
		   			done();
	   			});
			}
		);

		it(
			'it should create default admin account if database is empty',
			function(done){
				chai.request(apiRoot)
				.post('/users/authenticate')
				.send({
					"email":"admin",
					"password": "password"
				})
		    	.end(function(err,res){
		    		res.body.should.have.property('success').eql(true);
		    		res.body.should.have.property('msg');
		    		res.body.should.not.have.property('token');
		   			done();
	   			});
			}
		);


		// after the default admin is created
		// we can now log in using its credentials
		it(
			'it should allow login of the default admin account',
			function(done){
				chai.request(apiRoot)
				.post('/users/authenticate')
				.send({
					"email":"jrhod_baby@yahoo.com",
					"password": "password"
				})
		    	.end(function(err,res){
		    		res.body.should.have.property('success').eql(true);
		    		res.body.should.have.property('msg');
		    		res.body.should.have.property('token');
		    		res.body.should.have.property('user');
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
		let token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmY4NjI0MGM5YTAyMzEyMTMyMzI1NGMiLCJmaXJzdG5hbWUiOiJKZXJpYyIsImxhc3RuYW1lIjoiVGliYXlhbiIsImVtYWlsIjoianJob2RfYmFieUB5YWhvby5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCQwbmlvOHpEUEQvQkZ6cUN2Rk1CSXZldi5wMFpPbG9UeEVrOG9JLkxqeFlWZTYvcHMzSlhMeSIsInJvbGUiOiJhZG1pbiIsIl9fdiI6MCwiaWF0IjoxNjEwMTE5NDE3fQ.3joh_fCKp_XHQf8o6QaEUVPb6hA-liP5Gsdj2tnNq1k';
		it(
			
			"Should login user and return success, msg, token, and the user object", 
			(done) => {
				chai.request(apiRoot)
				.post('/users/register')
				.set({ Authorization: `Bearer '${token}'` })
				.send({
					"name":"Jeric Tibayan2",
					"email":"jrhod_baby21@yahoo.com",
					"username":"jrtib2",
					"password": "password2",
				    "role": "cashier"
				})
				.end((err, res) => {
					console.log(res.body);
					res.should.have.status(200);

					//if(err) return done(err);

					done();
				});
			}
		);		

	});
});
*/

