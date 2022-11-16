/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { MapItem } from 'common/types/map-item';
import styles from './Popup.module.css';
import { Info } from './components/Info';

interface Props {
    placemark: MapItem;
}

export function PopupContent({ placemark }: Props) {
    const firstImage = placemark.images[0];
    const restImages = placemark.images.slice(1);

    return (
        <div className={styles.popup}>
            {firstImage && (
                <img
                    key={firstImage.id}
                    src={firstImage.m.src}
                    width={firstImage.m.width}
                    height={firstImage.m.height}
                    className={styles.popup__preview}
                    alt={placemark.name}
                />
            )}
            <div className={styles.popup__content}>
                <div className={styles.popup__coords}>
                    {placemark.coords[0]}
                    {' '}
                    {placemark.coords[1]}
                </div>
                <h2 className={styles.popup__title}>{placemark.name}</h2>
                {placemark.street && (
                    <address className={styles.popup__address}>{placemark.street}</address>
                )}
            </div>
            <div className={styles.popup__info}>
                <Info placemark={placemark} />
            </div>
            <div className={styles.popup__images}>
                {restImages.map((src) => (
                    <img
                        key={src.id}
                        src={src.m.src}
                        width={src.m.width}
                        height={src.m.height}
                        className={styles.popup__image}
                        alt={placemark.name}
                    />
                ))}
            </div>
        </div>
    );
}
