var express = require('express');
var app = express();

app.use(/api, function (req, res, next) {
  next();
});

app.route('/api').post(function(req, res) {
    
    //console.log('Starting...');
	
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end();    
});

app.listen(process.env.PORT || 8080);
