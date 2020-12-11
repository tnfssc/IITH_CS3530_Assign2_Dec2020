import tls, { TlsOptions } from "tls";
import fs from "fs";

const args = process.argv.slice(2);
const PORT = parseInt(args[0] || process.env.PORT || "1337");

const options: TlsOptions = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem"),
  rejectUnauthorized: false,
};

const server = tls.createServer(options, socket => {
  console.log("Connected to client.");
  socket.on("data", data => {
    console.log(
      "Received: %s [it is %d bytes long]. [%d].",
      data.toString().replace(/(\n)/gm, ""),
      data.length,
      new Date().getTime()
    );
    socket.write(data, () => {
      console.log("Echoed the same at %d", new Date().getTime());
    });
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
  process.exit(1);
});
