import { Router } from "express";
import * as zmq from "zeromq";
const sock = zmq.socket("pub");

const routesPub = Router();

  sock.bind('tcp://127.0.0.1:3000');
  console.log('Publisher bound to port 3000');
  routesPub.post("/publish", (req, res) => {
    const { topic, speed, off } = req.body;
    const post = {
      topic,
      off,
      speed,
      date: new Date().toISOString(),
    };
    
    sock.send(["post", JSON.stringify(post)]);

    setInterval(() => {
      const post = {
        topic: topic,
        off: true,
        speed: Math.floor(Math.random() * 8) + 1,
        date: new Date().toISOString(),
      };
      
      console.log("Sending a multipart message envelope");
      sock.send([post.topic, JSON.stringify(post)]);
    }, 2000);
  console.table(post);
  res.sendStatus(200);
});


  

export default routesPub;
