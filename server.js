var dashing = require('dashing-js').Dashing();

// Set your auth token here
dashing.auth_token = 'd3b07384d113edec49eaa6238ad5ff00';

dashing.protected = function(req, res, next) {
    next();
}


// Set your default dashboard here
dashing.default_dashboard = 'sample';

dashing.start();
