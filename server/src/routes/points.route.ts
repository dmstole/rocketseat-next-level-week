import express from "express";
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';
import multerConfig from '../config/multer';

import PointsController from "../controllers/points.controller";

const routes = express.Router();
const pointsController = new PointsController();

const upload = multer(multerConfig);

const validation = {
    body: Joi.object().keys({
        name: Joi.string().required(),  
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(), //TODO regex
    })
}

routes
    .get("/points", pointsController.index)
    .get("/points/:id", pointsController.show)
    .post("/points",
        upload.single('image'),
        celebrate(validation, { abortEarly: false }),
        pointsController.create)

export default routes;