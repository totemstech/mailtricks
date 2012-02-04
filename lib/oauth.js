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
                                     "1.0A",
                                     "http://localhost:8080/oauthWindow.html",
                                     "HMAC-SHA1");

  // public
  var getRequestToken;  /* getRequestToken() */

  var that = {}
  
  getRequestToken = function() {
  }

  
  fwk.method(that, 'getRequestToken', getRequestToken, _super);

  return that;
};

exports.extractor = extractor;