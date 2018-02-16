var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function(){
    var app = express();
    
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    
    app.use(expressValidator());
    
    /*app.use((req, res, next) => {
        console.log(req.body)
        res.json(req.body)
        next()
    })*/
    
    consign() //consign({cwd:'payfast'})
     .include('controllers')
     .then('persistencia')
     .then('servicos')
     .into(app);
    
    return app;
};