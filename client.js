const tls = require("tls");

const args = process.argv.slice(2)
const PORT = args[1] || process.env.PORT || 1337;
const HOST = args[0] || process.env.HOST || "127.0.0.1";

var client = tls.connect(PORT, HOST, { rejectUnauthorized: false }, () => {
  if (client.authorized) {
    console.log("Connection authorized by a Certificate Authority.");
  } else {
    console.log("Connection not authorized: " + client.authorizationError);
  }
  client.write("I am the client sending you a message.");
});

client.on("data", (data) => {
  console.log("Received: %s [it is %d bytes long]", data.toString().replace(/(\n)/gm, ""), data.length);
  client.end();
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("error", (error) => {
  console.error(error);
  client.destroy();
});
