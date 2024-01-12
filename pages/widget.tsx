import React from 'react';
import { Map } from 'components/Map';
import { MapContextProvider } from 'components/Map/providers/MapProvider';
import placemarks from 'public/placemarks.geojson';

export default function Widget() {
    return (
        <MapContextProvider>
            <Map placemarksData={placemarks.features} showFilterHeading={false} />
        </MapContextProvider>
    );
}
