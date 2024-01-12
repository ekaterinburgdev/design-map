import React from 'react';
import { MapItemProperties } from 'common/types/map-item';
import { MARKER_FILTER_COLOR } from 'common/constants/colors';
import styles from './Info.module.css';

interface Props {
    type: MapItemProperties['type']
    name: MapItemProperties['name']
    description: MapItemProperties['description']
}

export function Info({ type, name, description }: Props) {
    const text = name !== description ? description : null;
    const color = MARKER_FILTER_COLOR[type];

    return (
        <div className={styles.info}>
            {type && <div className={styles.info__type} style={{ color }}>{type}</div>}
            {text && <div className={styles.info__description}>{text}</div>}
        </div>
    );
}
