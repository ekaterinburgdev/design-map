/* eslint-disable no-console */
import React, { useContext, useMemo } from 'react';
import L from 'leaflet';
import { Marker as LeafletMarker } from 'react-leaflet';
import { MapItem } from 'common/types/map-item';
import { MARKER_COLOR } from 'common/constants/colors';
import { MapContext } from '../MapProvider';
import styles from './Marker.module.css';

interface Props {
    placemark: MapItem;
}

export function Marker({ placemark }: Props) {
    const { openPopup } = useContext(MapContext);
    const onClick = () => {
        openPopup(placemark);
    };

    const html = useMemo(() => {
        if (placemark?.preview?.s?.src) {
            return `<img
                src="${placemark.preview.s.src}"
                class="${styles.marker}"
                style="color:${MARKER_COLOR[placemark.type]};"
            />`;
        }

        return `<div class="${styles.marker}" style="color:${MARKER_COLOR[placemark.type]};" />`;
    }, [placemark]);

    const icon = new L.DivIcon({
        popupAnchor: [0, -5],
        iconSize: [40, 40],
        html,
    });

    return (
        <LeafletMarker icon={icon} position={placemark.coords} eventHandlers={{ click: onClick }} />
    );
}
