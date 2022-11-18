import React from 'react';
import { MapItem } from 'common/types/map-item';
import styles from './Info.module.css';

interface Props {
    placemark: MapItem
}

export function Info({ placemark }: Props) {
    const type = String(placemark.type);
    const description = placemark.name !== placemark.description ? placemark.description : null;

    const items: { key: string, value: string }[] = [
        { key: 'Тип объекта', value: type },
    ].filter((item) => item.value);

    if (!description && items.length === 0) return null;

    return (
        <div className={styles.info}>
            {placemark.description && (
                <div className={styles.info__description}>{placemark.description}</div>
            )}
            {items.map((item) => (
                <div key={item.key} className={styles.infoitem}>
                    <div className={styles.infoitem}>
                        <div className={styles.infoitem__key}>{item.key}</div>
                        <div className={styles.infoitem__value}>{item.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
