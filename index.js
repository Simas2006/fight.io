var fs = require("fs");
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var PORT = process.argv[2] || 8000;

app.use("/scripts",express.static(__dirname + "/scripts"));
app.use("/imageassets",express.static(__dirname + "/imageassets"));

io.on("connection",function(client) {
  client.on("test",function(data) {
    console.log(data);
  });
});

server.listen(PORT);
console.log("Listening on port " + PORT);
