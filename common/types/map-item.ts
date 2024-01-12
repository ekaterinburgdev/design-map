import type { LatLngExpression } from 'leaflet';

export interface MapItemCollection {
    type: string;
    name: string;
    features: MapItem[];
}

export interface MapItem {
    type: string;
    geometry: MapItemGeometry;
    properties: MapItemProperties;
}

export interface MapItemGeometry {
    type: 'Point';
    coordinates: LatLngExpression;
}

export interface MapItemProperties {
    id: string;
    name: string;
    type: MapItemType;
    description: string;
    street: string;
    images: MapItemImage[];
}

export enum MapItemType {
    'Логотипы и айдентика',
    'Навигационные стелы',
    'Таблички ОКН',
    'Таблички ЧО',
    'Обычные адресные таблички',
    'Фризы остановок',
    'Светофор',
    'Исторические адресные таблички',
    'Уличная мебель',
    'Памятные таблички',
    'Транспорт',
    'Настенные таблички',
    'Столбы со стрелками',
}

export interface MapItemImage {
    m: MapItemImageSize;
    s: MapItemImageSize;
}

export interface MapItemImageSize {
    width: number;
    height: number;
    src: string;
}
