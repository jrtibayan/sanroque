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

// Register
router.post(
  '/register/payment',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const requestId = req.body.requestId
    const paymentDate = req.body.paymentDate
    const paymentAmount = req.body.amount
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

        trans.payments.push({ pDate: paymentDate, pAmount: paymentAmount })
        trans.balance = trans.balance - paymentAmount

        if (paymentToApply) {
          for (let i = 0; i < paymentToApply.length; i++) {
            paymentToApply[i].amount
            for (let i2 = 0; i2 < trans.requestedTests.length; i2++) {
              if (trans.requestedTests[i2].chemGroupId === paymentToApply[i].chemGroupId) {
                if (trans.requestedTests[i2].paid === null || trans.requestedTests[i2].paid === undefined) {
                  trans.requestedTests[i2].paid = paymentToApply[i].amount
                } else {
                  trans.requestedTests[i2].paid += paymentToApply[i].amount
                }
                break
              }
            }
          }
        }

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
