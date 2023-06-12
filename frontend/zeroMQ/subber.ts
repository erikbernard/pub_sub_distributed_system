//subber
import * as zmq from "zeromq";

const sock = zmq.socket("sub");

const run = async () => {
  await sock.connect("tcp://127.0.0.1:3000");
  sock.subscribe("kitty cats");
  console.log("Subscriber connected to port 3000");

  sock.on("message", (topic, message) => {
    console.log(
      "Received a message related to:",topic.toString(),
      "containing message:",message.toString()
    );
  });

};

run().catch((err) => console.error(err));
