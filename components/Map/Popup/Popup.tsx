import React, { useMemo } from 'react';
import { Popup as LeafletPopup } from 'react-leaflet';
import { MapItem } from 'common/types/map-item';
import { MARK_TYPE_COLOR } from 'common/constants/colors';
import styles from './Popup.module.css';

interface Props {
    placemark: MapItem;
}

export function Popup({ placemark }: Props) {
    const date = useMemo(() => {
        try {
            const formatter = new Intl.DateTimeFormat('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            return formatter.format(new Date(placemark.date));
        } catch (e) {
            return null;
        }
    }, [placemark.date]);

    return (
        <LeafletPopup className={styles.popup}>
            <h2 className={styles.popup__title}>{placemark.name}</h2>
            {placemark.name !== placemark.description && (
                <div className={styles.popup__description}>{placemark.description}</div>
            )}
            {placemark.street && (
                <address className={styles.popup__address}>{placemark.street}</address>
            )}
            <div style={{ color: MARK_TYPE_COLOR[placemark.type] }} className={styles.popup__type}>
                {placemark.type}
            </div>
            {date && (
                <div className={styles.popup__date}>
                    C
                    {' '}
                    {date}
                </div>
            )}
            <div className={styles.popup__images}>
                {placemark.images.map((src) => (
                    <img key={src} src={src} className={styles.popup__image} alt={placemark.name} />
                ))}
            </div>
        </LeafletPopup>
    );
}
