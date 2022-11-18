import type { LatLngExpression } from 'leaflet';

export enum MapItemType {
    'Логотипы и айдентика',
    'Навигационные стелы',
    'Таблички ОКН',
    'Таблички ЧО',
    'Обычные адресные таблички',
    'Фризы остановок',
    Светофор,
    'Исторические адресные таблички',
    'Уличная мебель',
    'Памятные таблички',
    Транспорт,
    'Настенные таблички',
}

export type MapItem = {
    name: string;
    type: MapItemType;
    coords: LatLngExpression;
    street: string;
    images: string[];
    date?: number;
    description: string;
};
