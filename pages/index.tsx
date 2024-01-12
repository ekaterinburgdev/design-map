import React from 'react';
import { Map } from 'components/Map';
import { Footer } from 'components/Footer/Footer';
import { MapContextProvider } from 'components/Map/providers/MapProvider';
import placemarks from 'public/placemarks.geojson';

export default function Home() {
    return (
        <>
            <MapContextProvider>
                <Map placemarksData={placemarks} />
            </MapContextProvider>

            <Footer />
        </>
    );
}
