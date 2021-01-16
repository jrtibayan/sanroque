process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')

// eslint-disable-next-line no-unused-vars
const should = chai.should()

// const mongoose = require('mongoose')

// const server = 'http:// localhost:3000'
const server = require('../app')

chai.use(chaiHttp)

localStorage.clear()

describe('SAN ROQUE APP', function () {
  describe('Not logged in', function () {
    beforeEach(function () {
      localStorage.removeItem('id_token')
    })

    describe('POST /users/authenticate', function () {
      it(
        'it should NOT allow log in when database is empty',
        function (done) {
          chai.request(server)
            .post('/users/authenticate')
            .send({
              email: 'jrhod_baby@yahoo.com',
              password: 'password'
            })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              else {
                res.should.have.status(200)
                res.body.should.have.property('success').eql(false)
                res.body.should.have.property('msg')
              }

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should create default admin account if database is empty',
        function (done) {
          chai.request(server)
            .post('/users/authenticate')
            .send({
              email: 'admin',
              password: 'password'
            })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')
              res.body.should.not.have.property('token')

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should NOT create default admin account if database is NOT empty',
        function (done) {
          chai.request(server)
            .post('/users/authenticate')
            .send({
              email: 'admin',
              password: 'password'
            })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should allow login of the default admin account',
        function (done) {
          chai.request(server)
            .post('/users/authenticate')
            .send({
              email: 'jrhod_baby@yahoo.com',
              password: 'password'
            })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')
              res.body.should.have.property('token')
              res.body.should.have.property('user')

              localStorage.setItem('id_token', res.body.token) // setting token will make browser recognize user as logged in
              localStorage.setItem('defaultAdmin', res.body.token) // save the token of admin to use it later if need to log in

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should NOT allow login of unauthorized users',
        function (done) {
          chai.request(server)
            .post('/users/authenticate')
            .send({
              email: 'jerictibayan@yahoo.com',
              password: 'password'
            })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')

              if (er) done(er)
              else done()
            })
        }
      )
    })

    describe('GET /users/profile', function () {
      it(
        'it should NOT display profile if user is NOT logged in',
        function (done) {
          chai.request(server)
            .get('/users/profile')
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(401)
              res.body.should.eql({})

              if (er) done(er)
              else done()
            })
        }
      )
    })

    describe('POST /users/register', function () {
      it(
        'it should NOT allow user to register if user is NOT logged in',
        function (done) {
          chai.request(server)
            .post('/users/register')
            .send({
              firstname: 'Jeric Tibayan7',
              lastname: 'Jeric Tibayan7',
              email: 'jrhod_baby7@yahoo.com',
              password: 'password7',
              role: 'director2'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(401)
              res.body.should.eql({})

              if (er) done(er)
              else done()
            })
        }
      )
    })
  })

  describe('Admin logged in', function () {
    beforeEach(function () {
      localStorage.removeItem('id_token')
      localStorage.setItem('id_token', localStorage.getItem('defaultAdmin'))
    })

    describe('GET /users/profile', function () {
      it(
        'it should display profile of logged in user',
        function (done) {
          chai.request(server)
            .get('/users/profile')
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('user')

              if (er) done(er)
              else done()
            })
        }
      )
    })

    describe('POST /users/register', function () {
      it(
        'it should allow user to register new user with cashier role',
        function (done) {
          chai.request(server)
            .post('/users/register')
            .send({
              firstname: 'Jeric Tibayan2',
              lastname: 'Jeric Tibayan2',
              email: 'jrhod_baby21@yahoo.com',
              password: 'password2',
              role: 'cashier'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should allow user to register new user with medtech role',
        function (done) {
          chai.request(server)
            .post('/users/register')
            .send({
              firstname: 'Jeric Tibayan3',
              lastname: 'Jeric Tibayan3',
              email: 'jrhod_baby3@yahoo.com',
              password: 'password3',
              role: 'medtech'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should allow user to register new user with radtech role',
        function (done) {
          chai.request(server)
            .post('/users/register')
            .send({
              firstname: 'Jeric Tibayan4',
              lastname: 'Jeric Tibayan4',
              email: 'jrhod_baby4@yahoo.com',
              password: 'password4',
              role: 'radtech'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should allow user to register new user with manager role',
        function (done) {
          chai.request(server)
            .post('/users/register')
            .send({
              firstname: 'Jeric Tibayan5',
              lastname: 'Jeric Tibayan5',
              email: 'jrhod_baby5@yahoo.com',
              password: 'password5',
              role: 'manager'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should allow user to register new user with director role',
        function (done) {
          chai.request(server)
            .post('/users/register')
            .send({
              firstname: 'Jeric Tibayan6',
              lastname: 'Jeric Tibayan6',
              email: 'jrhod_baby6@yahoo.com',
              password: 'password6',
              role: 'director'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)
              else done()
            })
        }
      )

      it(
        'it should NOT allow user to register a role that is not on his allowed action list',
        function (done) {
          chai.request(server)
            .post('/users/register')
            .send({
              firstname: 'Jeric Tibayan7',
              lastname: 'Jeric Tibayan7',
              email: 'jrhod_baby7@yahoo.com',
              password: 'password7',
              role: 'director2'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null

              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')

              if (er) done(er)
              else done()
            })
        }
      )
    })

    describe('NOT Logged in', function () {
      beforeEach(function () {
        localStorage.removeItem('id_token')
      })
    })
  })
})
