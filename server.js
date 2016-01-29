// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var twilio     = require('twilio');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 1337;        // set our port

var lastMessage;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/sms')
    .post(function(req, res) {
        console.log('Received sms: ' + JSON.stringify(req.body));
        lastMessage = req.body;
        res.send();
    });

router.route('/voice')
    .post(function(req, res) {
        console.log('Received voice: ' + JSON.stringify(req.body));
        lastMessage = req.body;
        var tresp = new twilio.TwimlResponse();
        tresp.say("Hello, Caviar. I am an automated answering system, but someone will call you back at this number shortly. You can also send text messages to this phone number and someone will read them.");
        res.set('Content-Type', 'text/xml');
        res.send(tresp.toString());
    });

router.route('/status')
    .get(function(req, res) {
        res.json({ lastMessage: lastMessage });
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/caviarbot', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);