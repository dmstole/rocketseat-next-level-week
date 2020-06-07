import express from "express";
import multer from 'multer';
import multerConfig from '../config/multer';

import PointsController from "../controllers/points.controller";

const routes = express.Router();
const pointsController = new PointsController();

const upload = multer(multerConfig);

routes
    .get("/points", pointsController.index)
    .get("/points/:id", pointsController.show)
    .post("/points", upload.single('image'), pointsController.create)

export default routes;


// TODO procurar por
// serializacao
// api transform