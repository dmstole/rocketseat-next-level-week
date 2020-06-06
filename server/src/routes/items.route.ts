import express from "express";

import ItemsController from "../controllers/items.controller";

const routes = express.Router();
const itemsController = new ItemsController();

routes
    .get("/items", itemsController.index)

export default routes;