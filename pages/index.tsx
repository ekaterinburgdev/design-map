import React from 'react';
import Head from 'next/head';
import { Map } from 'components/Map';
import { Footer } from 'components/Footer/Footer';
import { MapContextProvider } from 'components/Map/providers/MapProvider';
import placemarks from 'public/notion-static/placemarks.json';

const siteTitle = 'Карта объектов Дизайн-кода Екатеринбурга';
export default function Home() {
    return (
        <>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <MapContextProvider>
                <Map placemarksData={placemarks} />
            </MapContextProvider>

            <Footer />
        </>
    );
}
