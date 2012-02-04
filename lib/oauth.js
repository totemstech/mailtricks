var util = require('util');
var fwk = require('fwk');
var http = require('http');
var OAuth = require("oauth").OAuth;

/**
 * Gmail OAuth 1.0 Helper
 *
 * @extends {}
 *
 * @param spec {cfg, mongo}
 */
var oauth = function(spec, my) {
  my = my || {};
  var _super = {};        

  my.mongo = spec.mongo;
  my.cfg = spec.cfg;
  my.oa = new require("oauth").OAuth("https://www.google.com/accounts/OAuthGetRequestToken",
                                     "https://www.google.com/accounts/OAuthGetAccessToken",
                                     "863761295815.apps.googleusercontent.com",
                                     "xgPylSsvWQHjsSZi-lx2uXfF",
                                     "1.0",
                                     "http://localhost:8080/oauthWindow.html",
                                     "HMAC-SHA1");

  // public
  var getRequestToken;  /* getRequestToken() */
  var getAccessToken;   /* getAccessToken() */

  var that = {}
  
  /**
   * Retrieves a request token. It adds the scope header for 
   * access to Gmail IMAP
   * @param cb(err, oauth_token) err is set if an error occured
   */
  getRequestToken = function(cb) {
    oa.getOAuthRequestToken({ scope: 'https://mail.google.com/' },
                            function(err, oauth_token, oauth_token_secret, results) {
                              if(err)
                                cb(err);
                              else 
                                cb(null, 
                                   oauth_token, 
                                   oauth_token_secret);
                            });    
  };

  /**
   * Retrieves the access token from the verified request token
   * @param oauth_token the oauth token
   * @param oauth_token_secret the oauth token secret
   * @param oauth_verifier the retrieved verifier
   * @param cb(err, oauth_token, oauth_token_secret) 
   *        err is set if an error occured
   */
  getAccessToken = function(oauth_token, oauth_token_secret, oauth_verifier, cb) {
    oa.getOAuthAccessToken(oauth_token, oauth_verifier,
                           function(err, oauth_access_token, oauth_access_token_secret, results) {
                             if(err)
                               cb(err);
                             else
                               cb(null, 
                                  oauth_access_token, 
                                  oauth_access_token_secret);
                           });    
  };

  
  fwk.method(that, 'getRequestToken', getRequestToken, _super);
  fwk.method(that, 'getAccessToken', getRequestToken, _super);

  return that;
};

exports.oauth = oauth;