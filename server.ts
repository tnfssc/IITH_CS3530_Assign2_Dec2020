import tls from "tls";
import dgram from "dgram";
import chalk from "chalk";
import fs from "fs";

const args = {
  b: process.env.npm_config_broadcast,
  p: process.env.npm_config_port,
};

if (!args.b || !args.p) {
  console.log(chalk.redBright("\nERROR: Pass arguments for broadcast address (--broadcast) and port (--port)\n\n"));
  process.exit(1);
}

const PORT = parseInt(args.p);
const BROADCASTPORT = parseInt(args.b.split(":")[1]);
const MCAST_ADDR = args.b.split(":")[0];
const broadcastServer = dgram.createSocket({ type: "udp4", reuseAddr: true });
broadcastServer.bind(BROADCASTPORT, () => {
  broadcastServer.setBroadcast(true);
  broadcastServer.setMulticastTTL(128);
  broadcastServer.addMembership(MCAST_ADDR);
});

const server = tls.createServer(
  { key: fs.readFileSync("./certs/key.pem"), cert: fs.readFileSync("./certs/cert.pem"), rejectUnauthorized: false },
  socket => {
    console.log("Connected to client.");
    socket.on("data", (data: Buffer) => {
      console.log(
        "Received: %s [it is %d bytes long]. [%d].",
        data.toString().replace(/(\n)/gm, ""),
        data.length,
        new Date().getTime()
      );
      socket.write(data, () => {
        console.log("Echoed the same at %d", new Date().getTime());
      });
      broadcastServer.send(data, 0, data.length, BROADCASTPORT, MCAST_ADDR, () => console.log("Broadcasted the same!"));
    });
    socket.on("end", () => {
      console.log("EOT (End Of Transmission)");
    });
  }
);

server.listen(PORT, () => {
  console.log("I'm listening on port %d", PORT);
});

server.on("error", error => {
  console.error(error);
  process.exit(1);
});
