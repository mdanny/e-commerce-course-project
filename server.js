var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session'); // store data like user-id in temporary memory store, temp, local, mongodb
var cookieParser = require('cookie-parser'); //will parse the cookie header and handle cookie separation and encoding
// take the session data, encrypt it and send it to browser
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session); //we need to pass the session object to mongostore, so it
//will know it will be based on the session express library
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');

var app = express();

mongoose.connect(secret.database, function(err){
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
    secret: secret.secretKey,
    store: new MongoStore({url: secret.database, autoReconnect: true})
}));
app.use(flash()); //flash is dependent on session and cookie
app.use(passport.initialize());
app.use(passport.session()); //this is for serialize and deserialize

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(function(req, res, next) {
    Category.find({}, function(err, categories) {
        if (err) return next(err);
        res.locals.categories = categories;
        next();
    });
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);

app.listen(secret.port, function(err) {
	if (err) throw err;
	console.log("Server is Running on port " + secret.port);
});
