const mongoose = require('mongoose');

// Role Schema
const RoleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    allowedActions: {
        type: Array,
        required: true
    }
});


const Role = module.exports = mongoose.model('Role', RoleSchema);


module.exports.getRoleById = function(id, callback){
    Role.findById(id, callback);
}


module.exports.getRoleByName = function(name, callback){
    const query = {name: name};
    Role.findOne(query, callback);
}

module.exports.getRoles = function(query, callback){
    Role.find(query, callback);
}

module.exports.addRole = function(newRole, callback) {
    console.log('Inside Role Model - ADDROLE Start');

    newRole.save(callback);
    
    console.log('Inside Role Model - ADDROLE End');
}


module.exports.updateRole = function(query, set) {
    options = { "multi": true };

    const res = Role.updateOne(query, set, options, function (err) {
        if (err) return console.error(err);         
        console.log('Role update successful');
    });
}