import React from 'react';
import Head from 'next/head';
import { MapItem } from 'common/types/map-item';
import { Map } from 'components/Map';
import { Footer } from 'components/Footer/Footer';
import { MapContextProvider } from 'components/Map/providers/MapProvider';
import placemarks from 'public/notion-static/placemarks.json';

export default function Home() {
    return (
        <>
            <Head>
                <title>Карта дизайн-кода Екатеринбурга</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MapContextProvider>
                <Map placemarksData={placemarks as MapItem[]} />
            </MapContextProvider>

            <Footer />
        </>
    );
}
