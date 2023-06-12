import { Router } from "express";
import * as zmq from "zeromq";
const sock = zmq.socket("sub");

const routesSub = Router();

  sock.connect("tcp://127.0.0.1:3000");
  console.log("Subscriber connected to port 3000");

  routesSub.post("/subscribe", (req, res) => {
    const topic = req.body.topic;
    sock.subscribe(topic);
    console.log(`Subscribed to topic: ${topic}`);
    res.sendStatus(200);
  });

  routesSub.get("/messages", (req, res) => {
    res.json({ messages });
  });

  const messages: { topic: string; speed: number; off: boolean; date: Date }[] = [];

  sock.on("message", (topic, message) => {
    const messageObj = {
      topic: topic.toString(),
      message: message.toString(),
    };
    messages.push(JSON.parse(messageObj.message));
    console.table(
      JSON.parse(messageObj.message));
  });

export default routesSub;
