/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styles from './Copyright.module.css';

export function Copyright() {
    return (
        <div className={styles.copyright}>
            {'© '}
            <a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer">OpenStreetMap</a>
            {' | '}
            <a href="https://leafletjs.com/" target="_blank" rel="noreferrer">Leaflet</a>
            {' | '}
            <a href="https://ekaterinburg.design/" target="_blank" rel="noreferrer">ekaterinburg.design</a>
        </div>
    );
}
