import tls from "tls";
import dgram from "dgram";
import chalk from "chalk";
import Readline from "readline";

import { splitAddress } from "./functions";

const readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question: string) =>
  new Promise<string>(resolve => {
    readline.question(question, answer => {
      resolve(answer);
    });
  });

const args = {
  c: process.env.npm_config_connect,
  l: process.env.npm_config_listen,
};

if (!!args["c"] === !!args["l"]) {
  console.log(chalk.redBright("\nERROR: Pass (only) one argument for listen (--listen) or connect (--connect).\n\n"));
  process.exit(1);
}

if (args["c"]) {
  const { host: HOST, port: PORT } = splitAddress(args["c"]);
  const client = tls.connect({ rejectUnauthorized: false, host: HOST, port: PORT }, () => {
    if (client.authorized) {
      console.log("Connection authorized by a Certificate Authority.");
    } else {
      console.log("Connection not authorized: " + client.authorizationError);
    }
    console.log("Connected to server.");
    console.log("[Instructions: Type and press enter to send a message.]");
  });

  client.on("data", data => {
    console.log(
      "Received: %s [it is %d bytes long]. [%d].",
      data.toString().replace(/(\n)/gm, ""),
      data.length,
      new Date().getTime()
    );
    console.log("Enter a message to send (or exit): ");
  });

  client.on("close", () => {
    console.log("Connection closed");
    client.end(() => process.exit(0));
  });

  client.on("error", error => {
    console.error(error);
    client.destroy();
  });

  (async () => {
    for (; true; ) {
      const msg = await ask("");
      if (msg === "exit") {
        client.end(() => process.exit(0));
        break;
      } else client.write(msg, () => {});
    }
  })();
} else if (args["l"]) {
  const { host: MCAST_ADDR, port: BROADCASTPORT, type: ipv } = splitAddress(args["l"]);
  const client = dgram.createSocket({ type: ipv === 4 ? "udp4" : "udp6", reuseAddr: true });

  client.on("listening", () => {
    var address = client.address();
    console.log("UDP Client listening on " + address.address + ":" + address.port);
    console.log(address);
    client.setBroadcast(true);
    client.setMulticastTTL(128);
    client.addMembership(MCAST_ADDR);
  });

  client.on("message", (message, remote) => {
    console.log("MCast Msg: From: " + remote.address + ":" + remote.port + " - " + message);
  });

  client.bind(BROADCASTPORT);
}
