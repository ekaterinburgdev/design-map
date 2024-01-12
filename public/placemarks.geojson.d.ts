import type { MapItemCollection } from '../common/types/map-item';

declare module 'public/placemarks.geojson' {
    declare const CollectionData: MapItemCollection;
    export default CollectionData;
}
