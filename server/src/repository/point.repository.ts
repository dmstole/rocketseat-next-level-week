import { Transaction } from 'knex';

import knex from '../database/connection';
import { PointModel } from '../interfaces/point.interface';

class PointRepository {

    async findBy(where: { city: string, uf: string, items: number[] }) {
        const points: PointModel[] = await knex('points')
            .join("point_items", "points.id", "=", "point_items.point_id")
            .whereIn("point_items.item_id", where.items)
            .where("city", where.city)
            .where("uf", where.uf)
            .distinct()
            .select('points.*');

        return points;
    }

    async findById(id: number) {
        const point: PointModel = await knex('points')
            .select('*')
            .where('id', id)
            .first();

        return point;
    }

    async create(point: PointModel, trx?: Transaction) {
        if(!!trx) {
            return await trx('points').insert(point);
        }

        return await knex('points').insert(point);
    }

    async createItems(pointItems: any[], trx: Transaction) {
        await trx('point_items').insert(pointItems);
    }

}

export default new PointRepository();