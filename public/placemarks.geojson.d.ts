import type { MapItem } from '../common/types/map-item';

declare module 'public/placemarks.geojson' {
    declare const PlacemarkData: MapItem[];
    export default PlacemarkData;
}
