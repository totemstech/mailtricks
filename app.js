#!/usr/bin/env node

/**
 * Module dependencies.
 */

var util = require('util');
var fwk = require('fwk');
var express = require('express');
var app = module.exports = express.createServer();
var http = require('http');
var infra = require('infra');

// Configuration

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });

app.configure('production', function() {
    app.use(express.errorHandler()); 
  });

// cfg

var cfg = fwk.populateConfig(require("./config.js").config);


// Mongo

var mongo = new mongodb.Db('mailtricks', 
                           new mongodb.Server(my.cfg['MAILTRICKS_MONGO_HOST'], 
                                              parseInt(my.cfg['MAILTRICKS_MONGO_PORT'], 10), {
                                                'auto_reconnect': my.cfg['MAILTRICKS_MONGO_RECONNECT']
                                              }));


// Routes

app.get('/extract/:email', function(req, res, next) {    
    res.send('OK');
  });

app.get('/oauth/init', function(req, res, next) {
    
  });

app.get('/oauth/finish', function(req, res, next) {
    
  });


// Authentication & Start

(function() {  

  var shutdown = function(code) {
  	console.log('Exiting');
  	process.exit(code);
    };
    
  var auth = function(cb) {
    mongo.open(function(err, db_p) {
      if(err) console.log('ERROR MONGODB: ' + err);
      else {
        mongo.authenticate(cfg['MAILTRICKS_MONGO_USER'], 
                           cfg['MAILTRICKS_MONGO_PASS'], 
                           function(err, db_p) {
                             if(err) { console.log('ERROR MONGODB: ' + err); shutdown(1); }
                             else {
                               console.log('mongo: ok');
                               cb();
                             }
                           });
      }
      });	
  };
  
  console.log('Starting...');
  auth(function() {
      
      app.listen(8080);
      console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);		    
    });
})();
