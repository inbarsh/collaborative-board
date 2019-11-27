// use express
var express = require("express");

// create instance of express
var app = express();

// use http with instance of express
var http = require("http").createServer(app);

// start the server
var port = 3000;
http.listen(port, function () {
	console.log("Listening to port " + port);
});

// create socket instance with http
var io = require("socket.io")(http);

// add listener for new connection
// add headers
app.use(function (request, result, next) {
	result.setHeader("Access-Control-Allow-Origin", "*");
	next();
});
// create API for get_message
app.get("/get_shapes", function (request, result) {
	connection.query("SELECT * FROM shapes", function (error, shapes) {
		// return data will be in JSON format
		result.end(JSON.stringify(shapes));
	});
});
io.on("connection", function (socket) {
	// this is socket for each user
    console.log("User connected", socket.id);
    // server should listen from each client via it's socket
    socket.on("new_shape", function (data) {
        console.log("Client says", data);

        // save shape in database
        connection.query("INSERT INTO shapes (`user`, `shape`) VALUES ('" + socket.id + "','" + data + "')", function (error, result) {
            // server will send shapes to all connected clients
            io.emit("new_shape", {
                id: result.insertId,
                shape: data
            });
        });
    });
});

// use mysql
var mysql = require("mysql");

// create connection
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "web_board"
});

connection.connect(function (error) {
	// show error, if any
});