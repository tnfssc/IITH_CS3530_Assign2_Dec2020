# IITH_CS3530_Assign2_Dec2020

## What is this?
This is a server client pair demonstrating secure TLS connection between them and also UDP multicast of the same data.

## Prerequisites
- [OpenSSL](https://www.openssl.org/)
- [Bash (Unix shell)](https://www.gnu.org/software/bash/)
- [NodeJS 12+ Runtime](https://nodejs.org/en/)

---
## Get Started
- Initialize the project using `npm run init`
- Compile the project using `npm run build`
- Start the server using `npm run server --port=1337 --broadcast=230.185.192.108:41848`
- Start the client broadcaster using `npm run client --connect=localhost:1337`
- Start the client receiver using `npm run client --listen=230.185.192.108:41848`

---
## Docs
> __Server__
- Start the server using `npm run server --port=<PORT> --broadcast=<MCAST_ADDR+PORT>`. e.g. `npm run server --port=1337 --broadcast=230.185.192.108:41848`
> __Client Broadcaster__
- Start the client using `npm run client --connect=<SERVER_ADDR+PORT>`. e.g. `npm run client --connect=localhost:1337`
> __Client Receiver__
- Start the client using `npm run client --listen=<MCAST_ADDR+PORT>`. e.g. `npm run client --listen=230.185.192.108:41848`

---
## References
- [TLS Module Guide](https://nodejs.org/en/knowledge/cryptography/how-to-use-the-tls-module/)
- [TLS Module Docs](https://nodejs.org/api/tls.html)
- [UDP/datagram Module Docs](https://nodejs.org/api/dgram.html)
- [SSL Certificates](https://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.cmc.doc/ssl.html)
- [HTTPS Server tutorial](https://www.codexpedia.com/node-js/nodejs-tls-configuration-server-and-client-example/)
- [TCP Server tutorial](https://riptutorial.com/node-js/example/19326/tls-socket--server-and-client/)
