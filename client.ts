import tls from "tls";

const args = process.argv.slice(2);
if (args.length < 1) process.exit(1);
const PORT = args[1] || process.env.PORT;
const HOST = args[0] || process.env.HOST;

var client = tls.connect(
  { rejectUnauthorized: false, host: HOST.split(":")[0], port: parseInt(HOST.split(":")[1] || PORT) },
  () => {
    if (client.authorized) {
      console.log("Connection authorized by a Certificate Authority.");
    } else {
      console.log("Connection not authorized: " + client.authorizationError);
    }
    client.write("I am the client sending you a message.");
  }
);

client.on("data", data => {
  console.log("Received: %s [it is %d bytes long]", data.toString().replace(/(\n)/gm, ""), data.length);
  client.end();
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("error", error => {
  console.error(error);
  client.destroy();
});
