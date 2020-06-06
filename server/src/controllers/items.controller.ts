import { Request, Response } from 'express';
import knex from '../database/connection';

export default class ItemsController {

    async index(req: Request, res: Response) {
        const items: any[] = await knex('items').select('*');
        const serializedItems = items.map(item => ({
            id: item.id,
            title: item.title,
            // image_url: `http://localhost:3333/uploads/${item.image}`
            image_url: `http://192.168.0.2:3333/uploads/${item.image}`,
        }));
        res.json(serializedItems);
    }

}