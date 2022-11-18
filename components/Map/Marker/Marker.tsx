import React from 'react';
import L from 'leaflet';
import { Marker as LeafletMarker } from 'react-leaflet';
import { MapItem } from 'common/types/map-item';
import { MARK_TYPE_COLOR } from 'common/constants/colors';
import { Popup } from '../Popup';
import marker from './marker.svg';
import styles from './Marker.module.css';

interface Props {
    placemark: MapItem;
}

export function Marker({ placemark }: Props) {
    const icon = new L.DivIcon({
        popupAnchor: [0, -5],
        iconSize: [30, 30],
        html: `<img
            src="${marker.src}"
            class="${styles.marker}"
            style="
                border-color:${MARK_TYPE_COLOR[placemark.type]};
                background-color:${MARK_TYPE_COLOR[placemark.type]}
            "
        />`,
    });

    return (
        <LeafletMarker icon={icon} position={placemark.coords}>
            <Popup placemark={placemark} />
        </LeafletMarker>
    );
}
