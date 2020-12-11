import tls from "tls";
import Readline from "readline";
import { resolve } from "path";

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

const args = process.argv.slice(2);
if (args.length < 1) process.exit(1);
const PORT = args[1] || process.env.PORT || "1337";
const HOST = args[0] || process.env.HOST || "localhost:1337";

var client = tls.connect(
  { rejectUnauthorized: false, host: HOST.split(":")[0], port: parseInt(HOST.split(":")[1] || PORT) },
  () => {
    if (client.authorized) {
      console.log("Connection authorized by a Certificate Authority.");
    } else {
      console.log("Connection not authorized: " + client.authorizationError);
    }
    console.log("Connected to server.");
  }
);

client.on("data", data => {
  console.log(
    "Received: %s [it is %d bytes long]. [%d].",
    data.toString().replace(/(\n)/gm, ""),
    data.length,
    new Date().getTime()
  );
  console.log("Enter a message to send: ");
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
    } else client.write(msg, () => resolve());
  }
})();
