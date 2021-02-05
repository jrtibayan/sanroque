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
        'it should NOT allow login if user used the wrong password',
        function (done) {
          chai.request(server)
            .post('/users/authenticate')
            .send({
              email: 'jrhod_baby@yahoo.com',
              password: 'password2'
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
              firstname: 'Jeric Tibayan8',
              middlename: 'Padua8',
              lastname: 'Jeric Tibayan8',
              dateOfBirth: 'bday8',
              email: 'jrhod_baby8@yahoo.com',
              password: 'password8',
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

    describe('POST /patients/register', function () {
      it(
        'it should not allow to register new patient',
        function (done) {
          chai.request(server)
            .post('/patients/register')
            .send({
              firstname: 'F1',
              middlename: 'M1',
              lastname: 'L1',
              dateOfBirth: 'bday5',
              email: 'jrhod_babyp1@yahoo.com',
              contactNumber: '09173232323'
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
              middlename: 'Padua2',
              lastname: 'Jeric Tibayan2',
              dateOfBirth: 'bday2',
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
              middlename: 'Padua3',
              lastname: 'Jeric Tibayan3',
              dateOfBirth: 'bday3',
              email: 'jrhod_baby3@yahoo.com',
              password: 'password3',
              role: 'medtech',
              license: 'medtech LICENSE',
              signatoryName: 'signatoryName medtech'
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
              middlename: 'Padua4',
              lastname: 'Jeric Tibayan4',
              dateOfBirth: 'bday4',
              email: 'jrhod_baby4@yahoo.com',
              password: 'password4',
              role: 'radtech',
              license: 'radtech LICENSE',
              signatoryName: 'signatoryName radtech'
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
              firstname: 'Jeric5',
              middlename: 'Padua5',
              lastname: 'Tibayan5',
              dateOfBirth: 'bday5',
              contactNumber: 'contact 0917',
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

              localStorage.setItem('patient01_id', res.body.testOnly.id)
              localStorage.setItem('patient01_fullname', res.body.testOnly.fullname)

              done()
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
              middlename: 'Padua6',
              lastname: 'Jeric Tibayan6',
              dateOfBirth: 'bday6',
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
              middlename: 'Padua7',
              lastname: 'Jeric Tibayan7',
              dateOfBirth: 'bday7',
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

    describe('POST /patients/register', function () {
      it(
        'it should allow to register new patient',
        function (done) {
          chai.request(server)
            .post('/patients/register')
            .send({
              firstname: 'F1',
              middlename: 'M1',
              lastname: 'L1',
              dateOfBirth: 'bday5',
              email: 'jrhod_babyp1@yahoo.com',
              contactNumber: '09173232323'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              localStorage.setItem('patient02_id', res.body.testOnly.id)
              localStorage.setItem('patient02_fullname', res.body.testOnly.fullname)

              done()
            })
        }
      )

      it(
        'it should not allow to register new patient if missing required info',
        function (done) {
          chai.request(server)
            .post('/patients/register')
            .send({
              firstname: 'F1',
              lastname: 'L1',
              dateOfBirth: 'bday5',
              email: 'jrhod_babyp1@yahoo.com',
              contactNumber: '09173232323'
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

    describe('POST /transactions/register', function () {
      it(
        'it should allow to register new transaction',
        function (done) {
          chai.request(server)
            .post('/transactions/register/request')
            .send({
              requestDate: '1987-09-28',
              patientId: localStorage.getItem('patient02_id'),
              patient: localStorage.getItem('patient02_fullname'),
              requestedTests: [
                {
                  testCategoryId: 'chemId',
                  testGroupId: 'chemTestId1',
                  price: 100
                },
                {
                  testCategoryId: 'chemId',
                  testGroupId: 'chemTestId2',
                  price: 200
                },
                {
                  testCategoryId: 'hemaId',
                  testGroupId: 'hemaTestId1',
                  price: 1000
                }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              localStorage.setItem('testRequestId_01', res.body.testOnly.id)

              done()
            })
        }
      )

      it(
        'it should allow to register new transaction2',
        function (done) {
          chai.request(server)
            .post('/transactions/register/request')
            .send({
              requestDate: '1985-03-11',
              patientId: localStorage.getItem('patient01_id'),
              patient: localStorage.getItem('patient01_fullname'),
              requestedTests: [
                {
                  testCategoryId: 'chemId',
                  testGroupId: 'chemTestId3',
                  price: 400
                },
                {
                  testCategoryId: 'hemaId',
                  testGroupId: 'hemaTestId2',
                  price: 4000
                }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              localStorage.setItem('testRequestId_02', res.body.testOnly.id)

              done()
            })
        }
      )

      it(
        'it should allow to register new transaction3',
        function (done) {
          chai.request(server)
            .post('/transactions/register/request')
            .send({
              requestDate: '1985-03-11',
              patientId: localStorage.getItem('patient01_id'),
              patient: localStorage.getItem('patient01_fullname'),
              requestedTests: [
                {
                  testCategoryId: 'chemId',
                  testGroupId: 'chemTestId3',
                  price: 400
                },
                {
                  testCategoryId: 'hemaId',
                  testGroupId: 'hemaTestId2',
                  price: 4000
                }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              localStorage.setItem('testRequestId_03', res.body.testOnly.id)

              done()
            })
        }
      )

      it(
        'it should allow to register new transaction4',
        function (done) {
          chai.request(server)
            .post('/transactions/register/request')
            .send({
              requestDate: '1985-08-11',
              patientId: localStorage.getItem('patient01_id'),
              patient: localStorage.getItem('patient01_fullname'),
              requestedTests: [
                {
                  testCategoryId: 'chemId',
                  testGroupId: 'chemTestId3',
                  price: 400
                },
                {
                  testCategoryId: 'hemaId',
                  testGroupId: 'hemaTestId2',
                  price: 4000
                }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              localStorage.setItem('testRequestId_04', res.body.testOnly.id)

              done()
            })
        }
      )
    })

    describe('POST /transactions/register/payment', function () {
      it(
        'it should allow payment to be added to request1',
        function (done) {
          chai.request(server)
            .post('/transactions/register/payment')
            .send({
              requestId: localStorage.getItem('testRequestId_01'),
              paymentDate: '1985-03-11',
              appliedPayment: [
                { testGroupId: 'chemTestId1', amount: 100 },
                { testGroupId: 'chemTestId2', amount: 200 },
                { testGroupId: 'hemaTestId1', amount: 1000 }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )

      it(
        'it should allow payment to be added to request2',
        function (done) {
          chai.request(server)
            .post('/transactions/register/payment')
            .send({
              requestId: localStorage.getItem('testRequestId_02'),
              paymentDate: '1985-03-11',
              appliedPayment: [
                { testGroupId: 'chemTestId3', amount: 400 },
                { testGroupId: 'hemaTestId2', amount: 600 }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )

      it(
        'it should allow additional payment to be added to request2',
        function (done) {
          chai.request(server)
            .post('/transactions/register/payment')
            .send({
              requestId: localStorage.getItem('testRequestId_02'),
              paymentDate: '1985-04-11',
              appliedPayment: [
                { testGroupId: 'hemaTestId2', amount: 1300 }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )

      it(
        'it should NOT allow payment to be added if ID is NOT found',
        function (done) {
          chai.request(server)
            .post('/transactions/register/payment')
            .send({
              requestId: localStorage.getItem('testRequestId_02') + 'XXXX',
              paymentDate: '1985-05-11',
              appliedPayment: [
                { testGroupId: 'hemaTestId2', amount: 1300 }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )

      it(
        'it should NOT allow payment to be added if one of the test to be applied is not on requests',
        function (done) {
          chai.request(server)
            .post('/transactions/register/payment')
            .send({
              requestId: localStorage.getItem('testRequestId_02'),
              paymentDate: '1985-05-11',
              appliedPayment: [
                { testGroupId: 'hemaTestId2XXXXXX', amount: 1300 }
              ]
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )

      it(
        'it should NOT allow discount to be added if payment is already applied',
        function (done) {
          chai.request(server)
            .post('/transactions/register/discount')
            .send({
              requestId: localStorage.getItem('testRequestId_02'),
              discountDate: '1985-05-11',
              amount: '20.1%'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )

      it(
        'it should allow discount to be added using percentage',
        function (done) {
          chai.request(server)
            .post('/transactions/register/discount')
            .send({
              requestId: localStorage.getItem('testRequestId_04'),
              discountDate: '1985-05-11',
              amount: '20.1%'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )

      it(
        'it should NOT allow discount to be added if there is already a discount',
        function (done) {
          chai.request(server)
            .post('/transactions/register/discount')
            .send({
              requestId: localStorage.getItem('testRequestId_02'),
              discountDate: '1985-05-11',
              amount: '10.1%'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )

      it(
        'it should allow discount to be added using given amount',
        function (done) {
          chai.request(server)
            .post('/transactions/register/discount')
            .send({
              requestId: localStorage.getItem('testRequestId_03'),
              discountDate: '1985-05-11',
              amount: '678'
            })
            .set({ Authorization: localStorage.getItem('id_token') })
            .end(function (err, res) {
              let er = null
              if (err) er = err

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('msg')

              if (er) done(er)

              done()
            })
        }
      )
    })
  })
})
