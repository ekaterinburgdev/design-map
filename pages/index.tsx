import React from 'react';
import Head from 'next/head';
import { Map } from 'components/Map';
import { Filter } from 'components/Filter/Filter';
import { Footer } from 'components/Footer/Footer';

export default function Home() {
    return (
        <>
            <Head>
                <title>Ekaterinburg Map</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Map />

            <Filter />

            <Footer />
        </>
    );
}
