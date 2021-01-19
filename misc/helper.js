const conf = require('config')
sender = require('../config/gmail')
nodemailer = require('nodemailer')

exports.dlog = function (msg) {
  if (conf.debug) console.log(msg)
}

exports.randomString = function (length, chars) {
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

exports.emailRegistrationSuccessful = function (email, password) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: sender.email,
      pass: sender.password
    }
  })

  const mailOptions = {
    from: sender.email,
    to: email,
    subject: 'San Roque | You are now a registered user',
    text: 'Congratulations!\n\nYou are now registered to San Roque App.\nPlease use the credentials below for your first login.\nYou may change the password anytime from your dashboard.\n\nEmail: ' + email + '\nPassword: ' + password
  }
  h.dlog('Prepared mailOptions for mailing later')

  h.dlog('Will now email user his/her new password')
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      h.dlog('Failed to email the user')
      h.dlog(error)
    } else {
      h.dlog('Email sent')
    }
  })
}

exports.canAddNewRole = function (action, loggedUserRole, loggedUserAllowedActions = [], newUserRole) {
  const allowed = {}

  allowed.admin = [
    'register director',
    'register manager',
    'register medtech',
    'register radtech',
    'register cashier'
  ]

  allowed.manager = [
    'register medtech',
    'register radtech',
    'register cashier'
  ]

  if (loggedUserAllowedActions.includes(action) || allowed[loggedUserRole].includes(action)) return true

  return false
}
