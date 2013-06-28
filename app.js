
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

// a lazy man's database
var weapons = {
  "1": { "id": 1, "name": "Wakizashi", "description": "Similar to the Katana, except smaller" },
  "2": { "id": 2, "name": "Tanto", "description": "A Small Japanese Knife" },
  "3": { "id": 3, "name": "Kama", "description": "Originally used in farming, now used by Ninjas" }
};

function getRandomInt(min, max){
  return Math.floor((Math.random() * max) + min);
}

function getArrayOfItems(items){
  var key, item, myArray=[];
  for(key in items){
    item = items[key];
    if(item && typeof item === "object"){
      myArray.push(item);
    }
  }
  return myArray;
}

function getItem(id){
  var ndx, results = null;

  for(ndx=0; ndx < weapons.length; ndx += 1){
    if(id === weapons[ndx].id) {
      results = weapons[ndx];
      break;
    }
  }
  return result;
}

function getFreeId(items){
  var key;

  do {
    key = getRandomInt(1, 100000);
  } while(items[key]);

  return key;
}

/*
  Here is the REST api
 */

// GET all items
app.get('/weapons.json', function (req, res) {
  console.log("Get all items");
  var weaponsArray = getArrayOfItems(weapons);
  return res.send(weaponsArray);
});

// GET an item
app.get('/weapons.json/:id', function (req, res) {
  var ndx,
    id = req.params.id,
    results = getItem(id);

  console.log("Getting: " + id);
  return res.send(results);
});

// PUT (update) an item
app.put('/weapons.json/:id', function (req, res) {
  var id = req.params.id,
    body = req.body;

  weapons[id] = body;
  console.log("Updated: " + body.name);
  return res.send(body);
});

// DELETE an item
app.delete('/weapons.json/:id', function (req, res) {
  var id = req.params.id;
  delete weapons[id];
  console.log("Deleted: " + id);
  return res.send();
});

// POST (create) an item
app.post('/weapons.json', function (req, res) {
  var weapon = req.body;

  if(weapon && weapon.name && weapon.description){
    if(!weapon.id){
      weapon.id = getFreeId(weapons);
    }
    weapons[weapon.id] = weapon;
  }
  return res.send(weapon);
});

/*
  Kick off the server
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
