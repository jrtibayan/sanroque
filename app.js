const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');


// Connect to database
//mongoose.connect(config.database);
//MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true });
mongoose.connect(
    config.database, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);


// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});


// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});


const app = express();


const users = require('./routes/users');
const doctors = require('./routes/doctors');
const patients = require('./routes/patients');
const transactions = require('./routes/transactions');


const port = 3000;
//const port = process.env.PORT || 8080;


// CORS Middleware
app.use(cors());


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// Body Parser Middleware
app.use(bodyParser.json());


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);


app.use('/users', users);
app.use('/doctors', doctors);
app.use('/patients', patients);
app.use('/transactions', transactions);


// Index Route
app.get('/', (req, res) => { 
    res.send('Invalid Endpoint2'); 
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


function initializeDatabase() {
    // list of roles with their allowed actions
    const Role = require('./models/role');
    function registerRole(newRole) {
        newRole.save(
            (err, role) => {
                if(err) {
                    console.log('Error adding role');
                    //res.json({success: false, msg: 'Error adding role'});
                } else {
                    console.log('Role registered');
                    //res.json({success: true, msg: 'Role added'});
                }
            }
        );
    }
    
    let newRole = new Role({
        name: 'admin',
        allowedActions: [
            'register director',
            'register manager',
            'register medtech',
            'register xraytech',
            'register cashier'
        ]
    });
    registerRole(newRole);

    newRole = new Role({
        name: 'manager',
        allowedActions: [
            'register medtech',
            'register xraytech',
            'register cashier'
        ]
    });
    registerRole(newRole); 

}

// Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);

    //initializeDatabase();
});