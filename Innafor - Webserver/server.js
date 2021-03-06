const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();
const port = (process.env.PORT || 3000);


const users = require('./server_modules/brukere.js');
const survey = require('./server_modules/survey.js');
const support = require('./server_modules/support.js');
const feed = require('./server_modules/feed.js');


app.set('port', port);
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-auth, group');
    next();
});

app.use('/app/brukere/', users);
app.use('/app/survey/', survey);
app.use('/app/support/', support);
app.use('/app/feed/', feed);


app.listen(app.get('port'), function (){
    console.log('server running', app.get('port'));
});

module.exports  = app;