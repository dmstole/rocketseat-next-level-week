import knex from "../database/connection";

import { ItemModel } from '../interfaces/item.interface';

class ItemRepository {
    async findAll() {
        const items: any[] = await knex('items').select('*');

        return items;
    }

    async findItemsByPoint(pointId?: number) {

        if(!pointId) {
            return [];
        }

        const items: ItemModel[] = await knex("items")
            .join("point_items", "items.id", "=", "point_items.item_id")
            .where("point_items.point_id", pointId)
            .select("items.title", "items.image");

        return items;
    }
}

export default new ItemRepository();