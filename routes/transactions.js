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
      discount: 0,
      balance: 0
    })

    for (let i = 0; i < newTransaction.requestedTests.length; i++) {
      newTransaction.total = newTransaction.total + newTransaction.requestedTests[i].price
      newTransaction.requestedTests[i].paid = 0
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
              if (trans.requestedTests[x].testGroupId === paymentToApply[i].testGroupId) {
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
    const discountInput = req.body.amount.replace(/\s+/g, '')

    let discountPercent = null
    let discountAmount = null

    h.dlog('\n\n\nInside TRANSACTIONS Route - REGISTER Discount Start')
    h.dlog('Adding Discount for Test Request ID ' + requestId)

    Transaction.getTransactionById(
      requestId,
      (err, trans) => {
        if (err) {
          h.dlog('Failed to find test request')
          return res.json({ success: false, msg: 'Failed to find test request' })
        }

        if (trans.discount > 0) {
          return res.json({ success: false, msg: 'A discount has already been applied to this transaction' })
        }

        if (trans.total !== trans.balance) {
          return res.json({ success: false, msg: 'Discount can only be applied for transactions without recorded payment' })
        }

        if (/\d+%/.test(discountInput)) { // PERCENTAGE
          discountPercent = 0.01 * parseFloat(discountInput.replace('%', ''))
          discountAmount = Math.ceil(discountPercent * trans.total)
        } else if (/^[0-9]*$/.test(discountInput)) { // NUMBER
          discountAmount = Math.ceil(discountInput)
        } else { // INVALID
          return res.json({ success: false, msg: 'Invalid amount. Format accepted are (Numbers only [1000] or pergentage [5%])' })
        }

        let discountLeft = discountAmount
        for (let i = 0, amountToDiscount = 0; i < trans.requestedTests.length; i++) {
          if (i === trans.requestedTests.length - 1) {
            amountToDiscount = discountLeft
          } else {
            amountToDiscount = ((((trans.requestedTests[i].price * 100) / trans.total) * 0.01) * discountAmount)
            amountToDiscount = Math.round((amountToDiscount + Number.EPSILON) * 100) / 100
          }
          trans.requestedTests[i].discount = amountToDiscount
          discountLeft -= amountToDiscount
        }

        if (discountAmount <= 0 || discountAmount > trans.balance) {
          return res.json({ success: false, msg: 'Invalid amount. Amount must be greater than Zero and less than or equal to the payable amount' })
        }

        trans.balance = trans.balance - discountAmount

        Transaction.updatePayments(
          requestId,
          {
            requestedTests: trans.requestedTests,
            discount: discountAmount,
            balance: trans.balance
          }
        )

        return res.json({ success: true, msg: 'Transaction added' })
      }
    )
  }
)

module.exports = router
