"use strict";

var tls = require("tls");

const args = process.argv.slice(2)
const PORT = args[1] || process.env.PORT || 1337;
const HOST = args[0] || process.env.HOST || "127.0.0.1";
console.log(process.argv)
// Pass the certs to the server and let it know to process even unauthorized certs.
var options = {
  rejectUnauthorized: false,
};

var client = tls.connect(PORT, HOST, { rejectUnauthorized: false }, () => {
  // Check if the authorization worked
  if (client.authorized) {
    console.log("Connection authorized by a Certificate Authority.");
  } else {
    console.log("Connection not authorized: " + client.authorizationError);
  }

  // Send a friendly message
  client.write("I am the client sending you a message.");
});

client.on("data", function (data) {
  console.log("Received: %s [it is %d bytes long]", data.toString().replace(/(\n)/gm, ""), data.length);

  // Close the connection after receiving the message
  client.end();
});

client.on("close", function () {
  console.log("Connection closed");
});

// When an error ocoures, show it.
client.on("error", function (error) {
  console.error(error);

  // Close the connection after the error occurred.
  client.destroy();
});
