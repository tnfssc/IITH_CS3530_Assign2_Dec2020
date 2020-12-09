const tls = require("tls");
const fs = require("fs");

const args = process.argv.slice(2);
const PORT = parseInt(args[0]) || process.env.PORT || 1337;

const options = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem"),
  rejectUnauthorized: false,
};

const server = tls.createServer(options, socket => {
  socket.write("I am the server sending you a message.");
  socket.on("data", function (data) {
    console.log("Received: %s [it is %d bytes long]", data.toString().replace(/(\n)/gm, ""), data.length);
  });
  socket.on("end", () => {
    console.log("EOT (End Of Transmission)");
  });
});

server.listen(PORT, () => {
  console.log("I'm listening on port %d", PORT);
});

server.on("error", error => {
  console.error(error);
  server.destroy();
});
