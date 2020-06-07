import { Request, Response } from 'express';
import knex from '../database/connection';

import serializationFactory from "../services/serialize.factory";
import validateService from "../services/validate.service";
import pointRepository from "../repository/point.repository";
import itemRepository from "../repository/item.repository";
import { PointModel } from '../interfaces/point.interface';

export default class PointsController {

    async create(req: Request, res: Response) {
        const trx = await knex.transaction();

        try {
            const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body;

            const point: PointModel = { image: req.file.filename, name, email, whatsapp, latitude, longitude, city, uf };

            const insertedIds = await pointRepository.create(point, trx);

            const parsedItems = serializationFactory.convertToArrayNumber(items)

            const point_id = insertedIds[0];
            const pointItems = serializationFactory.convertArrayValuesToArrayObject(parsedItems, { point_id });

            await pointRepository.createItems(pointItems, trx);

            await trx.commit();

            res.json({
                success: true,
                message: "Ponto criado com sucesso.",
                result: { ...point, id: point_id },
            });
        } catch (error) {
            console.error("ERROR POINT CREATED", error);
            await trx.rollback();
            res.status(500).json({
                success: false,
                error,
                result: null,
            });
        }
    }

    async index(req: Request, res: Response) {
        const { city, uf, items }: ParserQsWithPoint = req.query;

        const parserdItems = serializationFactory.convertToArrayNumber(items);

        const points = await pointRepository.findBy({ city, uf, items: parserdItems });

        const serializedPoints = points?.map((point) => serializationFactory.serializedWithUploadFolder<PointModel>(point));

        res.json(serializedPoints);
    }

    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const point = await pointRepository.findById(Number(id));

            validateService.valid(!point, "Point not found.");

            const serializedPoint = serializationFactory.serializedWithUploadFolder<PointModel>(point);

            const items = await itemRepository.findItemsByPoint(point?.id);

            const attributes = ['title', 'image'];
            const serializedItems = serializationFactory.serializeArray<PointModel>(items, attributes, "serializedWithUploadFolder")

            res.json({ ...serializedPoint, items: serializedItems });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

}

type ParserQsWithPoint = { city: string, uf: string, items: string[] } & any;