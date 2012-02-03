var fwk = require('fwk');
var config = fwk.baseConfig(); 

config['MAILTRICKS_MONGO_HOST'] = 'dummy-env';
config['MAILTRICKS_MONGO_PORT'] = 'dummy-env';
config['MAILTRICKS_MONGO_USER'] = 'dummy-env';
config['MAILTRICKS_MONGO_PASS'] = 'dummy-env';
config['MAILTRICKS_MONGO_RECONNECT'] = true;

exports.config = config;
