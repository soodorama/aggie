var fs = require('fs');
var express = require('express');

var module = {};
var modules = fs.readdirSync('./modules').map(
    function(element) { return element.split('.')[0] });

var app = express.createServer();

// Support the .keys() function for all objects.
Object.prototype.keys = function()
{
  var keys = [];
  for(var i in this) if (this.hasOwnProperty(i))
  {
    keys.push(i);
  }
  return keys;
}

// Setup routing for the apis.
function setup_route(app, route, md)
{ 
  var keys = md.keys(); 
  app.get('/' + route, function(req, res) {
    res.json({'functions': keys});
  });
  
  // Iterate through the routing keys and setup route to function mappings.
  for (var i=0; i < keys.length; i++) {
    app.get('/' + route + '/' + keys[i], function(req, res) {
      var path = req.path.split('/').filter(function(str) {
        return !(!str || 0 === str.length)
      });
      var m = path[0], f = path[1];
      res.json(md[f].call());
    });
  }
};

// Load modules from the modules directory.
function load_modules(app)
{
  for (var i=0; i < modules.length; i++) {
    module[modules[i]] = require('./modules/' + modules[i]);
    setup_route(app, modules[i], module[modules[i]]);
  }
};

// Setup the base module information for each module.
app.get('/', function(req, res) {
  res.json({
    'services': modules.map(
      function(mod) { return module[mod].info(); }
    )
  });
});

load_modules(app);
app.listen(3000);
