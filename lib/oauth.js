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

  my.tokens = {};

  my.mongo = spec.mongo;
  my.cfg = spec.cfg;
  my.oauth = new (require("oauth").OAuth)("https://www.google.com/accounts/OAuthGetRequestToken",
                                          "https://www.google.com/accounts/OAuthGetAccessToken",
                                          "863761295815.apps.googleusercontent.com",
                                          "xgPylSsvWQHjsSZi-lx2uXfF",
                                          "1.0",
                                          "http://localhost:8080/oauth/callback",
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
    my.oauth.getOAuthRequestToken({ scope: 'https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email' },
                                  function(err, oauth_token, oauth_token_secret, results) {
                                    if(err)
                                      cb(err);
                                    else {
                                      my.tokens[oauth_token] = { token: oauth_token,
                                                                 secret: oauth_token_secret,
                                                                 date: new Date };
                                      cb(null, 
                                         oauth_token);

                                      // https://www.googleapis.com/userinfo/email?alt=json
                                    }
                                  });    
  };

  /**
   * Retrieves the access token from the verified request token
   * @param token the oauth token
   * @param verifier the retrieved verifier
   * @param cb(err, oauth_token, oauth_token_secret) 
   *        err is set if an error occured
   */
  getAccessToken = function(token, verifier, cb) {
    my.oauth.getOAuthAccessToken(token, my.tokens[token].secret, verifier,
                                 function(err, oauth_access_token, oauth_access_token_secret, results) {
                                   delete my.tokens[token];
                                   if(err)
                                     cb(err);
                                   else
                                     cb(null, 
                                        oauth_access_token, 
                                        oauth_access_token_secret,
                                        results);
                                 });    
  };


  /**
   * tokens storage cleanup called periodically and in charge of 
   * suppressing unused tokens older than 3h
   */
  setInterval(function() {
      var now = new Date;
      for(var t in my.tokens) {
        if(my.tokens.hasOwnProperty(t)) {
          if((now.getTime() - my.tokens[t].date.getTime()) > (1000 * 60 * 60 * 3))
            delete my.tokens[t];
        }
      }
    }, 60 * 1000);
  
  
  fwk.method(that, 'getRequestToken', getRequestToken, _super);
  fwk.method(that, 'getAccessToken', getAccessToken, _super);

  return that;
};

exports.oauth = oauth;