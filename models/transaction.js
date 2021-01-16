const mongoose = require('mongoose');

// Transaction Schema
const TransactionSchema = mongoose.Schema({
    patientId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    tests: {
        type: Array,
        required: true
    }
});

const Transaction = module.exports = mongoose.model('Transaction', TransactionSchema);


module.exports.getTransactionById = function(id, callback){
    Transaction.findById(id, callback);
}

module.exports.getTransactionByName = function(firstname, lastname, callback){
    const query = {firstname: firstname, lastname: lastname};
    Transaction.findOne(query, callback);
}

module.exports.getMultipleTransactionsByName = function(firstname, lastname, callback){
    const query = {firstname: firstname, lastname: lastname};
    Transaction.find(query, callback);
}

//module.exports.getTransactions = function(query, callback){
//    Role.find(query, callback);
//}

module.exports.addTransaction = function(newTransaction, callback) {
    console.log('Inside Transaction Model - ADDTRANSACTION Start');

    console.log(newTransaction);

    newTransaction.save(callback);
    
    console.log('Inside Transaction Model - ADDPATIENT End');
}


module.exports.updateTransaction = function(query, set) {
    options = { "multi": true };

    const res = Transaction.updateOne(query, set, options, function (err) {
        if (err) return console.error(err);         
        console.log('Transaction update successful');
    });
}