// pubber.js
import * as zmq from "zeromq";

const sock = zmq.socket("pub");

const run = async () => {
  await sock.bind("tcp://127.0.0.1:3000");
  console.log("Publisher bound to port 3000");

  // setInterval(() => {
  //   console.log("Sending a multipart message envelope");
  //   sock.send(["kitty cats", "meow!"]);
  // }, 1500);
}

run().catch((err) => console.error(err));

