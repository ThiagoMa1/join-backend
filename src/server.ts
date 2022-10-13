import express, { NextFunction, Request, Response } from "express";

import db from "../models";
import clientesRouter from "./routes/clientes";

const app = express();
const port = 3000;

app.use(express.json());

app.use(clientesRouter);

db.sequelize
  .sync({ force: true })
  // .sync()
  .then((result: any) => {
    app.listen(port);
  })
  .catch((err: Error) => console.log(err));
