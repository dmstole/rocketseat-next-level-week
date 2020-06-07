import env from '../config/env';

class SerializeFactory {
    serializedWithUploadFolder<T>(obj: T): T {
        return this.createObjectWithImageUrl(obj, "uploads");
    }

    serializedWithAssetFolder<T>(obj: T): T {
        return this.createObjectWithImageUrl(obj, "assets");
    }

    createObjectWithImageUrl<T>(obj: any, folderName: "uploads" | "assets"): T {
        console.log(env.root);
        const root = `${env.root}/${folderName}`;

        return {
            ...obj,
            image_url: `${root}/${obj['image']}`
        };
    }

    serializeArray<T>(
        items: any[],
        attributes: string[],
        fnSerialize: "serializedWithAssetFolder" | "serializedWithUploadFolder") {

        return items.map(item => ({
            ...this[fnSerialize]<T>(
                this.clone(item, attributes)
            )
        }));
    }

    clone(item: any, attributes: string[]) {
        const clonedItem = attributes
            .reduce((prev: any, cur: string) => {
                prev[cur] = item[cur];
                return prev;
            }, {});

        return clonedItem;
    }

    convertToArrayNumber(items: string[], separator = ',') {
        const convertedArray = String(items)
            .split(separator)
            .map((item) => Number(item.trim()));

        return convertedArray;
    }

    convertArrayValuesToArrayObject(items: (string | number)[], obj: any): any[] {
        return items.map((item_id: number | string) => {
                const keys = Object.keys(obj);
                const clonedObj = this.clone(obj, keys);
            
                clonedObj['item_id'] = item_id;

                return clonedObj;
            });
    }
}

export default new SerializeFactory();

