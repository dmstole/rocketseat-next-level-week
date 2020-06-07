import { Request, Response } from 'express';

import serializationFactory from "../services/serialize.factory";
import itemRepository from "../repository/item.repository";

export default class ItemsController {

    async index(req: Request, res: Response) {
        const items: any[] = await itemRepository.findAll();

        const attributes = ["id", "title", "image"];
        const serializedItems = serializationFactory.serializeArray(items, attributes, "serializedWithAssetFolder");

        res.json(serializedItems);
    }

}