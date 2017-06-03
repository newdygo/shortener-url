var express = require('express');
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId
var app = express();

var connectionString = 'mongodb://newdygo:newdygo99894517@ds029436.mlab.com:29436/shortener-url-api';

app.use(/new\/(http|https|ftp|ftps)\:\/\//, function (req, res, next) {
  next();
});

app.use(/api, function (req, res, next) {
  next();
});

app.route(/new\/(http|https|ftp|ftps)\:\/\//).get(function (req, res) {
 
  var url = req.url.replace('new/', '');
  
  if (/(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,.\/?%&=]*)?/.test(url) || /(ftp(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,.\/?%&=]*)?/.test(url)) {
    
    mongodb.connect(connectionString, function(err, db) {
    
      if (!err) {
        
        db.collection('urls').insert({url: url}, function(err2, data) {
                  
          if (data.ops[0] !== undefined) {
            
            var url_res = {original_url: url, short_url: 'https://ionit-fcc-shortener-url.herokuapp.com//' + data.ops[0]._id};
            
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(url_res));
            res.end();
          }
        });
        
        db.close();
      }
    });
  }
});

app.route('/api').post(function(req, res) {
    
    console.log('Starting...');
	
    res.writeHead(200, {'Content-Type': 'application/json'});
    //res.write(JSON.stringify(url_res));
    res.end();
	
    //res.status(200);
    //res.send({message: "OK"});
    
});

app.listen(process.env.PORT || 8080);
