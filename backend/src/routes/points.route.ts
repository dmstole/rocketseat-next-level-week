import express from "express";

import PointsController from "../controllers/points.controller";

const routes = express.Router();
const pointsController = new PointsController();

routes
    .get("/points", pointsController.index)
    .get("/points/:id", pointsController.show)
    .post("/points", pointsController.create)

export default routes;