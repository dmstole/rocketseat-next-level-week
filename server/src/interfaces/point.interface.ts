export interface PointModel {
    id?: number;
    name: string;
    email: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    city: string;
    uf: string;
    items?: string[];
    image: string;
}