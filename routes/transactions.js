const express = require('express')
const router = express.Router()
const passport = require('passport')

const h = require('../misc/helper')

const Transaction = require('../models/transaction')

// Register
router.post(
  '/register/request',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    h.dlog('\n\n\nInside TRANSACTIONS Route - REGISTER Request Start')
    h.dlog('Adding Request by ' + req.body.patient)

    const transaction = req.body
    const newTransaction = new Transaction({
      requestDate: transaction.requestDate,
      patientId: transaction.patientId,
      patient: transaction.patient,
      requestedTests: transaction.requestedTests,
      payments: [],
      total: 0,
      balance: 0
    })

    for (let i = 0; i < newTransaction.requestedTests.length; i++) {
      newTransaction.total = newTransaction.total + newTransaction.requestedTests[i].price
    }

    newTransaction.balance = newTransaction.total

    newTransaction.balance = String(newTransaction.balance)
    newTransaction.total = String(newTransaction.total)

    Transaction.addTransaction(newTransaction, (err, transaction) => {
      if (err) {
        h.dlog('Error adding transaction')
        return res.json({ success: false, msg: 'Error adding transaction' })
      }

      h.dlog('Transaction registered')
      return res.json(h.appRes(
        { success: true, msg: 'Transaction added' },
        { id: newTransaction._id }
      ))
    })
  }
)

// Register Payment
router.post(
  '/register/payment',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const requestId = req.body.requestId
    const paymentDate = req.body.paymentDate
    let paymentAmount = 0
    const paymentToApply = req.body.appliedPayment

    h.dlog('\n\n\nInside TRANSACTIONS Route - REGISTER Payment Start')
    h.dlog('Adding Payment for Test Request ID ' + requestId)

    Transaction.getTransactionById(
      requestId,
      (err, trans) => {
        if (err) {
          h.dlog('Failed to find test request')
          return res.json({ success: false, msg: 'Failed to find test request' })
        }

        if (paymentToApply) {
          for (let i = 0; i < paymentToApply.length; i++) {
            paymentAmount += paymentToApply[i].amount

            let foundIndex = -1
            for (let x = 0; x < trans.requestedTests.length; x++) {
              if (trans.requestedTests[x].chemGroupId === paymentToApply[i].chemGroupId) {
                foundIndex = x
                break
              }
            }

            if (foundIndex > -1) {
              if (trans.requestedTests[foundIndex].paid === null || trans.requestedTests[foundIndex].paid === undefined) {
                trans.requestedTests[foundIndex].paid = paymentToApply[i].amount
              } else {
                trans.requestedTests[foundIndex].paid += paymentToApply[i].amount
              }
            } else {
              return res.json({ success: false, msg: 'Failed to find one of the tests to apply payment on' })
            }
          }
        }

        trans.payments.push({ pDate: paymentDate, pAmount: paymentAmount })
        trans.balance = trans.balance - paymentAmount

        Transaction.updatePayments(
          requestId,
          {
            requestedTests: trans.requestedTests,
            payments: trans.payments,
            balance: trans.balance
          }
        )

        return res.json({ success: true, msg: 'Transaction added' })
      }
    )
  }
)

// Register Discount
router.post(
  '/register/discount',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const requestId = req.body.requestId
    const discountDate = req.body.discountDate
    const discountAmount = req.body.amount.trim()

    console.log(/^[0-9]*$/.test('20'))
    console.log(/^[0-9]*$/.test('20%'))
    console.log(/^[0-9]*$/.test('20 3123'))
    console.log(/^[0-9]*$/.test('20,342'))
    console.log(/^[0-9]*$/.test('20.342'))

// use this for percentage --> \\d+(?:\\.\\d+)?%

    if (/\d+%/.test(discountAmount)) {
console.log('------------>discount is percent')
    } else if(/^[0-9]*$/.test(discountAmount)) {
console.log('------------>discount is number')
    } else {
console.log('------------>discount is INVALID')
      return res.json({ success: false, msg: 'Invalid amount. Format accepted are (Numbers only [1000] or pergentage [5%])' })
    }
return res.json({ success: true, msg: 'Invalid amount. Format accepted are (Numbers only [1000] or pergentage [5%])' })

    h.dlog('\n\n\nInside TRANSACTIONS Route - REGISTER Discount Start')
    h.dlog('Adding Discount for Test Request ID ' + requestId)

    Transaction.getTransactionById(
      requestId,
      (err, trans) => {
        if (err) {
          h.dlog('Failed to find test request')
          return res.json({ success: false, msg: 'Failed to find test request' })
        }

        if (paymentToApply) {
          for (let i = 0; i < paymentToApply.length; i++) {
            paymentAmount += paymentToApply[i].amount

            let foundIndex = -1
            for (let x = 0; x < trans.requestedTests.length; x++) {
              if (trans.requestedTests[x].chemGroupId === paymentToApply[i].chemGroupId) {
                foundIndex = x
                break
              }
            }

            if (foundIndex > -1) {
              if (trans.requestedTests[foundIndex].paid === null || trans.requestedTests[foundIndex].paid === undefined) {
                trans.requestedTests[foundIndex].paid = paymentToApply[i].amount
              } else {
                trans.requestedTests[foundIndex].paid += paymentToApply[i].amount
              }
            } else {
              return res.json({ success: false, msg: 'Failed to find one of the tests to apply payment on' })
            }
          }
        }

        trans.payments.push({ pDate: paymentDate, pAmount: paymentAmount })
        trans.balance = trans.balance - paymentAmount

        Transaction.updatePayments(
          requestId,
          {
            requestedTests: trans.requestedTests,
            payments: trans.payments,
            balance: trans.balance
          }
        )

        return res.json({ success: true, msg: 'Transaction added' })
      }
    )
  }
)


module.exports = router
