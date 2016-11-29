/* Katie Hoskins
 * comp20 Tufts University Fall '16
 * Homework Assignment 3
 */


/* Boilerplate setup stuff */
var express = require('express');
var cool = require('cool-ascii-faces');
var http = require('http');
var app = express();
var bodyParser = require('body-parser'); // Required if we need to use HTTP query or post parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

/* Setup the mongodb database to use */
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/2048scores';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

/* More boilerplate setup from inital Heroku example */
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


/* GET method to get JSON formatted data containing the scores for a particular
 * user sorted in descending order. The target username is passed in as a query
 * string and unpacked then used in the mongodb query
*/
app.get('/scores.json', function(request, response) {
	var targetName = request.param("username");
    response.setHeader('Content-Type', 'application/json');

	db.collection('scores', function(er, collection) {
		collection.find({username: targetName}).sort({score:-1}).toArray(function(err, result) {
			if (!err) {
				response.json(result);
			} else {
				response.send('Whoops, something went terribly wrong!');
			}
		});
	});
});

app.post('/submit.json', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	try {
		var new_username = request.body.username;
		var new_score = request.body.score;
		var score_int = parseInt(new_score);
		var new_grid = request.body.grid;

		var toInsert = {username: new_username,
                  score: score_int,
                  grid: new_grid,
                  created_at: new Date()
              };

    	db.collection('scores', function(error, coll) {
		console.log("Error: " + error);
		coll.insert(toInsert, function(error, saved) {
			if (error) {
				console.log("Error: " + error);
				response.send(500);
			}
			else {
				response.send(200);
			}
		});
		});
	} 

	catch (err) {
		console.log ("ERROR: Unable to store data from POST request, missing parameters.");
	}

});


/* GET method for the Game Center homepage - responds with html page that
 * displays a list of the highest scores for the game.
*/
app.get('/', function(request, response) {
  response.set('Content-Type', 'text/html');
 
  db.collection('scores', function(error, coll) {
		console.log("Error: " + error);
	
				var indexPage =""; 
				db.collection('scores', function(er, collection) {
					collection.find().sort({score:-1}).toArray(function(err, cursor) {
						if (!err) 
						{
							indexPage += "<!DOCTYPE HTML><html><head><title>2048 Game Center</title><link href=\"stylesheets/gamecenter.css\" rel=\"stylesheet\"/></head><body><h1>2048 Game Center</h1><span class=\"subheader\"> Here's how you've been doing on 2048! Keep up the good work! </span> <table><tbody><tr><th>User</th><th>Score</th><th>Timestamp</th></tr>";
							for (var count = 0; count < cursor.length; count++) {
								indexPage += "<tr><td>" + cursor[count].username + "</td>";
								indexPage += "<td>" + cursor[count].score + "</td>";
								indexPage += "<td>" + cursor[count].created_at + "</td></tr>";
							}
							indexPage += "</table></body></html>"
							response.send(indexPage);
						} else 
						{
							response.send('<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
						}
					});
				});
	});
});

/* Old functionality from previous homework - responds with JSON data containing 
 * most recent MBTA red line time information 
 */
app.get('/redline.json', function(request, response) {
	var request = require("request");

	response.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');


	request({
	  uri: "http://developer.mbta.com/lib/rthr/red.json",
	  method: "GET",
	  timeout: 10000,
	  followRedirect: true,
	  maxRedirects: 10
	}, function(error, resp, body) {
  		response.send(body);
	});
});

app.listen(process.env.PORT || 3000);


