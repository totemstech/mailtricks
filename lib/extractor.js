var util = require('util');
var fwk = require('fwk');
var http = require('http');

/**
 * Gmail OAuth Imap Extractor Object
 *
 * The Gmail Extractor will use the All Mail, Sent Mail
 * and Chats labels to extract email up to a given date
 * 
 * @extends {}
 *
 * @param spec {cfg, mongo}
 */
var extractor = function(spec, my) {
  my = my || {};
  var _super = {};        

  my.mongo = spec.mongo;
  my.cfg = spec.cfg;

  // public
  var run;   /* run(email, oauth_token) */   

  var that = {}

  /**
   * Runs the extractor on the given email with the provided token
   * @param email the email to run on
   * @param token the valid oauth token associated
   * @param since a Date representing how far to go. If since is not specified, 
   *              the extraction will go up to 1 wk by default
   * @param cb(err) when done, err defined if an error occured
   */
  run = function(email, token, since, cb) {
    
  };
  
  fwk.method(that, 'run', run, _super);

  return that;
};

exports.extractor = extractor;