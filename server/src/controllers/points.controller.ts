import { Request, Response, response } from 'express';
import knex from '../database/connection';

export default class PointsController {

    async create(req: Request, res: Response) {
        const trx = await knex.transaction();

        try {
            const {
                name, email, whatsapp, image,
                latitude, longitude,
                city, uf,
                items
            } = req.body || {};

            const point = {
                image,
                name, email, whatsapp,
                latitude, longitude,
                city, uf,
            };

            const insertedIds = await trx('points').insert(point);

            const point_id = insertedIds[0];
            const pointItems = items.map((item_id: number) => ({ item_id, point_id }));

            await trx('point_items').insert(pointItems);

            await trx.commit();

            res.json({
                success: true,
                message: "Ponto criado com sucesso.",
                result: { ...point, id: point_id }
            });
        } catch (error) {
            await trx.rollback();

            res.status(500).json({
                success: false,
                error,
                result: null
            });
        }
    }

    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query || {};

        const parserdItems = String(items)
            .split(',')
            .map((item) => Number(item.trim()));

        const points: any[] = await knex('points')
            .join("point_items", "points.id", "=", "point_items.point_id")
            .whereIn("point_items.item_id", parserdItems)
            .where("city", String(city))
            .where("uf", String(uf))
            .distinct()
            .select('points.*');

        res.json(points);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params || {};
        const point: any = await knex('points').select('*').where('id', id).first();

        if (!point) {
            res.json({ message: "Point not found." });
            return;
        }

        const items = await knex("items")
            .join("point_items", "items.id", "=", "point_items.item_id")
            .where("point_items.point_id", id)
            .select("items.title", "items.image");

        const serializedItems = items.map(item => ({
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`
        }));

        res.json({ ...point, items: serializedItems });
    }

}