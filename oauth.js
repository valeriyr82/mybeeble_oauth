
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var passport = require('passport');
var fs = require('fs');
var mysql  = require('mysql');

var config = require('./config/config');
var auth = require('./config/middlewares/authorization');
var oauthserver = require('node-oauth2-server');

//Bootstrap db connection
var dbPool = mysql.createPool(config.db1);


var app = express();

app.set('port', config.port || 8000);

app.configure(function() {
    var oauth = oauthserver({
        model: require('./config/oauthmodel')(dbPool),
        grants: ['password'],
        debug: true
    });
    app.use(express.bodyParser());
    app.use(oauth.handler());
    app.use(oauth.errorHandler());
    /*app.all('*', function(req, res,next){
        //if(!req.get('Origin')) return next();
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        next();
    });*/
});

app.get('/', function(req, res){
    res.send('Secret area');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});