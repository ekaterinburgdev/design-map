import React from 'react';
import Head from 'next/head';
import { Map } from 'components/Map';
import { MapItem } from 'common/types/map-item';
import { Footer } from 'components/Footer/Footer';
import { MapContextProvider } from 'components/Map/providers/MapProvider';
import getMapItems from './api/lib/get-map-items';

interface Props {
    placemarksData: MapItem[];
}

export default function Home({ placemarksData }: Props) {
    return (
        <>
            <Head>
                <title>Ekaterinburg Map</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MapContextProvider>
                <Map placemarksData={placemarksData} />
            </MapContextProvider>

            <Footer />
        </>
    );
}

export async function getStaticProps() {
    return {
        props: { placemarksData: await getMapItems() },
        revalidate: 60,
    };
}
