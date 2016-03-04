var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

var User = require('./models/user');

var app = express();

mongoose.connect('mongodb://root:qwerty123@ds019468.mlab.com:19468/ecommerce', function(err){
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database")
	}
});

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "dan!@#$"
}));
app.use(flash()); //flash is dependent on session and cookie


app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);

app.listen(1234, function(err) {
	if (err) throw err;
	console.log("Server is Running");
})
