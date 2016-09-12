
var express = require('express');
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId
var app = express();

var connectionString = 'mongodb://newdygo:newdygo99894517@ds029436.mlab.com:29436/shortener-url-api';
var id;

app.use(/new\/(http|https|ftp|ftps)\:\/\//, function (req, res, next) {
  next();
});

app.use(/new\/*/, function (req, res, next) {
  next();
});

app.use('/:id', function (req, res, next) {
  next();
});

app.route(/new\/(http|https|ftp|ftps)\:\/\//).get(function (req, res) {
 
  var url = req.url.replace('new/', '');
  var url_res = {original_url: url, short_url: id};
  
  if (/(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,.\/?%&=]*)?/.test(url) || /(ftp(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,.\/?%&=]*)?/.test(url)) {
    
    mongodb.connect(connectionString, function(err, db) {
    
      if (!err) {
        
        db.collection('urls').insert({url: url}, function(err2, data) {
          
          id = 'https://ionit-fcc-shortener-url.herokuapp.com/' + data.ops[0]._id;
          console.log('LOGGINS: ' + id);
        });
        
        db.close();
      }
    });
  }
  
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(url_res));
  res.end();
});

app.route(/new\/*/).get(function (req, res) {
  
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.write('INVALID URL!!');
  res.end();
  
});

app.route('/:id').get(function (req, res) {
  
  var id = req.url.replace('/', '');
  
  mongodb.connect(connectionString, function(err, db) {
    
      if (!err) {
        
        db.collection('urls').find({
            _id: new objectId(id)
          
        }).toArray(function(err2, data) {
          
          res.redirect(data[0].url);
        });
      }
  });
  
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.write('INVALID URL!!');
  res.end();
});

app.listen(process.env.PORT || 8080);