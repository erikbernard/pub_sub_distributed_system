import express from "express";
import routesSub from "./routesSub"; 
import routesPub from "./routesPub"; 
import cors from "cors";
class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
}

private middlewares(): void {
      this.server.use(cors());
    this.server.use(express.json());
  }

  private routes(): void {
    this.server.use(routesSub);
    this.server.use(routesPub);
}
}

export default new App().server;
