import Knex from "knex";

export async function seed(knex: Knex) {

    const points =

        await knex("items").delete()
            .then((res) => console.log('items deleted', res))
            .then(() => knex("points").delete())
            .then((res) => console.log('points deleted', res))
            .then(() => ([
                { "title": "Lâmpadas", "image": "lampadas.svg" },
                { "title": "Pilhas e Baterias", "image": "baterias.svg" },
                { "title": "Papéis e Papelão", "image": "papeis-papelao.svg" },
                { "title": "Resíduos Eletrônicos", "image": "eletronicos.svg" },
                { "title": "Resíduos Orgânicos", "image": "organicos.svg" },
                { "title": "Oléo de Cozinha", "image": "oleo.svg" },
            ]))
            .then((items) => knex("items").insert(items))
            .then((res) => console.log('items created', res))
            .then(() => ([
                {
                    "image": "https://lh5.googleusercontent.com/p/AF1QipOZ-kaIFAafwSRAls16cXFMyi2vG5Kbzd1EPCNL=w457-h240-k-no",
                    "name": "Mercado Shibata",
                    "email": "mercado@shibata.com.br",
                    "whatsapp": "12 99999 9999",
                    "latitude": -23.2374172,
                    "longitude": -45.8965644,
                    "city": "SJC",
                    "uf": "SP"
                },
                {
                    "image": "https://lh5.googleusercontent.com/p/AF1QipPH1QmCzoMojFDmwl62JReLjeXGPAcASpVCWN3x=w408-h272-k-no",
                    "name": "The Burger",
                    "email": "lanche@theburger.com.br",
                    "whatsapp": "12 99999 9999",
                    "latitude": -23.2518456,
                    "longitude": -45.9000064,
                    "city": "SJC",
                    "uf": "SP",
                },
                {
                    "image": "https://lh5.googleusercontent.com/p/AF1QipPv1ROitoIjDKxHJbnN1RBqGTODC8SQeg2bHbL6=w408-h240-k-no-pi0-ya340-ro-0-fo100",
                    "name": "Quality Hort Frut",
                    "email": "hortfruit@quality.com.br",
                    "whatsapp": "12 99999 9999",
                    "latitude": -23.2346348,
                    "longitude": -45.8807247,
                    "city": "SJC",
                    "uf": "SP",
                }
            ]))
            .then((points) => knex("points").insert(points))
            .then((res) => console.log('points created', res))
            .then(async () => {
                const _points = await knex('points').select('*');
                const pointItems = [];
                for (const point of _points) {
                    pointItems.push({
                        point_id: point.id,
                        item_id: 1
                    });
                }

                const res = await knex('point_items').insert(pointItems);
                console.log('point_items', res);
            })
            .catch((err) => console.error(err))
            .finally(() => console.log('finish seed'));
}