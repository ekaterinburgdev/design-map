import type { LatLngExpression } from 'leaflet';

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

export type MapItem = {
    id: string;
    name: string;
    type: MapItemType;
    coords: LatLngExpression;
    street: string;
    date?: number;
    description: string;
    images: MapItemImage[];
    preview: MapItemImage;
};

export type MapItemImage = {
    m: MapItemImageSize;
    s: MapItemImageSize;
};

export type MapItemImageSize = {
    width: number;
    height: number;
    src: string;
};
