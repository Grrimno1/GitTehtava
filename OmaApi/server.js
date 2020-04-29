
// Asenna ensin express npm install express --save

var express = require('express');
var cookieParser = require('cookie-parser');
var app=express();

var fs = require("fs");

var bodyParser = require('body-parser');
var customerController = require('./customerController');
app.use(cookieParser());
const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Staattiset filut
app.use(express.static('public'));

// REST API Asiakas
app.get('/', function(req, res, next){
        if (req.cookies && typeof req.cookies["userData"] === "undefined") {
            fs.readFile("login.html", function(err, data){
                res.writeHead(200, {'Content-Type' : 'text/html'});
                res.write(data);
                res.end(); 
            });
        } else {
            next()
        }              
}, function(req, res) {
    fs.readFile("kayttis.html", function(err, data){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end(); 
    });
}
),
app.get('/setuser', (req, res) => {
    var user = {
        name : req.query.nimi,
        loginTime: Date.now(),
        id: 1234
    }
    res.cookie("userData", user);
    res.redirect('/');
    console.log(req.cookies);
});
app.get('/cookies', (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies);
    
})
app.get('/logout',(req, res) => {
    res.clearCookie("userData");
    res.redirect('/');
});
app.route('/Tyypit')
    .get(customerController.fetchTypes)


app.route('/Haku')
    .get(customerController.haku)

app.route('/Lisaa')
    .post(customerController.lisaaAsiakas)

app.route('/poista')
    .delete(customerController.poista)

app.route('/Asiakas/:id')
    .get(customerController.haeAsiakas)
    .put(customerController.update)

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Server running AT http://${port}/`);
  });
*/  