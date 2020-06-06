import { Express } from "express";
import fs from "fs";

export default (app: Express) => {
    fs
        .readdirSync(__dirname)
        .filter((file: string) => (file.indexOf('route') !== -1))
        .forEach(async (pathFile: string) => {
            import("./" + pathFile)
                .then((route) => {
                    app.use(route.default);
                });
        });
}