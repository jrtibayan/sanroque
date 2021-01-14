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
  describe('POST /users/authenticate', function () {
    describe('Not logged in', function () {
      beforeEach(function () {
        localStorage.removeItem('id_token')
      })

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
                try {
                  'null'.should.be.ok
                } catch {
                  if (err) er = err

                  console.log(er)
                }
              }

              if (er) return done(err)
              done()
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
              if (err) return done(err)

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')
              res.body.should.not.have.property('token')
              done()
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
              if (err) return done(err)

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')

              done()
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
              if (err) return done(err)

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')
              res.body.should.have.property('token')
              res.body.should.have.property('user')

              localStorage.setItem('id_token', res.body.token)
              localStorage.setItem('defaultAdmin', res.body.token)
              localStorage.getItem('id_token').should.be.ok // means someone is logged in

              done()
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
              if (err) return done(err)

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')
              done()
            })
        }
      )
    })
  })

  describe('GET /users/profile', function () {
    describe('Admin logged in', function () {
      beforeEach(function () {
        localStorage.removeItem('id_token')
        localStorage.setItem('id_token', localStorage.getItem('defaultAdmin'))
      })

      it(
        'it should display profile if user is logged in',
        function (done) {
          chai.request(server)
            .get('/users/profile')
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              if (err) return done(err)

              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('user')
              done()
            })
        }
      )
    })
    describe('NOT Logged in', function () {
      beforeEach(function () {
        localStorage.removeItem('id_token')
      })

      it(
        'it should NOT display profile if user is NOT logged in',
        function (done) {
          chai.request(server)
            .get('/users/profile')
            .end(function (err, res) {
              if (err) return done(err)

              res.body.should.eql({})
              res.body.should.not.have.property('token')
              done()
            })
        }
      )
    })
  })

  describe('POST /users/register', function () {
    describe('Admin logged in', function () {
      beforeEach(function () {
        localStorage.removeItem('id_token')
        localStorage.setItem('id_token', localStorage.getItem('defaultAdmin'))
      })
      it(
        'it should allow user to register another user',
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
              if (err) return done(err)

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')
              done()
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
