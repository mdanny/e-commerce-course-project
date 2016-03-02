var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://root:qwerty123@ds019048.mlab.com:19048/e-commerce-course-project', function(err){
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database")
	}
})

// Middleware
app.use(morgan('dev'));

app.get('/', function (req, res) {
	var name = "Cristi"
	res.json("My name is " + name)
}) 



app.listen(3000, function(err) {
	if (err) throw err;
	console.log("Server is Running")
})
