var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var fs = require('fs');
var favicon = require('serve-favicon');

global._ = require('lodash');
global.Config = require('./config.js');
global.Promise = require('bluebird');
global.Helper = require('./libs/helper');

module.exports = function () {
  var app = express();
  server = require('http').createServer(app);

  app.use(bodyParser.urlencoded({
    extended:true
  }));

  app.use(favicon('./public/images/favicon.ico'));

  app.use(bodyParser.json());
  app.set('views',['./app/views','./public']);
  app.set('view engine','html');
  app.engine('html',ejs.renderFile);
  app.use(express.static('./public'));

  // load all controllers
  var controllers = require('path').join(__dirname, './controllers/');
  _.chain(fs.readdirSync(controllers))
    .filter(function(file) {
      stat = fs.statSync(controllers + file);
      return stat.isDirectory();
    })
    .forEach(function(dir) {
      _.chain(fs.readdirSync(controllers + dir))
        .filter(function(file) {
          return /js$/.test(file);
        })
        .map(function(file) {
          return file.split('.js')[0];
        })
        .forEach(function(file) {
          var mod = _.map(file.split('_'), function(_file){
            return _.capitalize(_file)
          }).join('');
          global[dir + mod] = require("./controllers/"+dir+"/"+file);
        })
        .commit();
    })
    .commit();

  require('./controllers')(app);

  var port = process.env.PORT || 3000;
  server.listen(port, function(){
    console.log('http://localhost:' + port);
  });
  app.server = server;

  return app;
};
