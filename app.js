#!/usr/bin/env node

/**
 * Module dependencies.
 */

var util = require('util');
var fwk = require('fwk');
var express = require('express');
var app = module.exports = express.createServer();
var http = require('http');
var mongodb = require('mongodb');

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
                           new mongodb.Server(cfg['MAILTRICKS_MONGO_HOST'], 
                                              parseInt(cfg['MAILTRICKS_MONGO_PORT'], 10), {
                                                'auto_reconnect': cfg['MAILTRICKS_MONGO_RECONNECT']
                                              }));


// OAuth

var oauth = require('./lib/oauth.js').oauth({ cfg: cfg,
                                              mongo: mongo });

// Routes

app.get('/extract/:email', function(req, res, next) {    
    res.send('OK');
  });

app.get('/oauth/request', function(req, res, next) {
    oauth.getRequestToken(function(err, token) {
        if(err) 
          next(err);
        else {
          res.json({ oauth_token: token });
        }
      });    
  });

// https://www.google.com/accounts/OAuthAuthorizeToken?oauth_token=&hd=default&hl=en

app.get('/oauth/callback', function(req, res, next) {
    oauth.getAccessToken(req.param('oauth_token'),
                         req.param('oauth_verifier'),
                         function(err, token, secret, results) {
                           console.log(err);
                           console.log('token: ' + token);
                           console.log('secret: ' + secret);
                           console.log(results);
                           if(err) 
                             next(err);
                           else {
                             res.json({ oauth_token: token,
                                        oauth_token_secret: secret,
                                        results: results });
                           }
                         });
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
