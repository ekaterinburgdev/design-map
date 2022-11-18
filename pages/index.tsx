import React from 'react';
import Head from 'next/head';
import { Map } from 'components/Map';
import { Footer } from 'components/Footer/Footer';
import { MapContextProvider } from 'components/Map/providers/MapProvider';

export default function Home() {
    return (
        <>
            <Head>
                <title>Ekaterinburg Map</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MapContextProvider>
                <Map />
            </MapContextProvider>

            <Footer />
        </>
    );
}
