import React from 'react';
import { MapItem } from 'common/types/map-item';
import { Map } from 'components/Map';
import { MapContextProvider } from 'components/Map/providers/MapProvider';
import placemarks from 'public/notion-static/placemarks.json';

export default function Widget() {
    return (
        <MapContextProvider>
            <Map placemarksData={placemarks as MapItem[]} showHeading={false} />
        </MapContextProvider>
    );
}
