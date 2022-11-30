import React from 'react';
import { Map } from 'components/Map';
import { Footer } from 'components/Footer/Footer';
import { MapContextProvider } from 'components/Map/providers/MapProvider';
import { MapItem } from 'common/types/map-item';

export default function Home({ placemarks }: { placemarks: MapItem[] }) {
    return (
        <>
            <MapContextProvider>
                <Map placemarksData={placemarks} />
            </MapContextProvider>

            <Footer />
        </>
    );
}

export async function getStaticProps() {
    const res = await fetch('https://map.ekaterinburg.design/notion-static/placemarks.json');
    const placemarks = await res.json();

    return {
        props: {
            placemarks,
        },
        revalidate: 10,
    };
}
