import type { LatLngExpression } from 'leaflet';

export type MapItem = {
    name: string;
    type: string;
    coords: LatLngExpression;
    street: string;
    images: string[];
    date?: number;
    description: string;
};
