"use strict";

var tls = require("tls");
var fs = require("fs");

const args = process.argv.slice(2)
const PORT = parseInt(args[1]) || process.env.PORT || 1337;

var options = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem"),
  rejectUnauthorized: false,
};

var server = tls.createServer(options, function (socket) {
  // Send a friendly message
  socket.write("I am the server sending you a message.");

  // Print the data that we received
  socket.on("data", function (data) {
    console.log("Received: %s [it is %d bytes long]", data.toString().replace(/(\n)/gm, ""), data.length);
  });

  // Let us know when the transmission is over
  socket.on("end", function () {
    console.log("EOT (End Of Transmission)");
  });
});

// Start listening on a specific port and address
server.listen(PORT, function () {
  console.log("I'm listening on port %d", PORT);
});

// When an error occurs, show it.
server.on("error", function (error) {
  console.error(error);

  // Close the connection after the error occurred.
  server.destroy();
});
