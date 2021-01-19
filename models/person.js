const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User Schema
const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  middlename: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  suffix: {
    type: String
  },
  license: {
    type: String
  },
  signatoryName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: String
  },
  allowedActions: {
    type: [String]
  }
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback)
}

module.exports.getUserByEmail = function (email, callback) {
  const query = { email: email }
  User.findOne(query, callback)
}

module.exports.getUsers = function (query, callback) {
  User.find(query, callback)
}

module.exports.addUser = function (newUser, callback) {
  // console.log('Inside User Model - ADDUSER Start');

  // console.log('Will now encrypt the password');
  bcrypt.genSalt(
    10,
    (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          // console.log('Password encryption failed');
          throw err
        }
        newUser.password = hash
        newUser.save(callback)
      })
    }
  )

  // console.log('Inside User Model - ADDUSER End');
}

module.exports.updateUser = function (query, set) {
  options = { multi: true }

  const res = User.updateOne(query, set, options, function (err) {
    if (err) return console.error(err)
    // console.log('User update successful');
  })
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(
    candidatePassword,
    hash,
    (err, isMatch) => {
      if (err) throw err
      callback(null, isMatch)
    }
  )
}

module.exports.changePassword = function (email, password) {
  bcrypt.genSalt(
    10,
    (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err
        newPassword = hash

        query = { email: email }
        update = { $set: { password: newPassword } }

        User.updateUser(query, update)
        // console.log('Password updated');
      })
    }
  )
}
