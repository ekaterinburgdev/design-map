import React, {
    useContext, useEffect, useMemo, useState,
} from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { Filter } from 'components/Filter/Filter';
import { COORDS_EKATERINBURG } from 'common/constants/coords';
import { MapItem } from 'common/types/map-item';
import { isMobile } from 'common/isMobile';

import { Marker } from '../Marker';
import { MapContext } from '../MapProvider';
import { Popup } from '../Popup';

import styles from './MapMainContainer.module.css';
import 'leaflet/dist/leaflet.css';

const DEFAULT_ZOOM = isMobile ? 12 : 15;

function MapMainContainer() {
    const position: [number, number] = COORDS_EKATERINBURG;
    const [isLoaded, setLoaded] = useState(false);
    const { placemarks, selectedMarksTypes, savePlacemarks } = useContext(MapContext);

    useEffect(() => {
        async function init() {
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: iconRetinaUrl.src,
                iconUrl: iconUrl.src,
                shadowUrl: shadowUrl.src,
            });

            const response = await fetch('/api/map');
            const placemarksData: MapItem[] = await response.json();

            savePlacemarks(placemarksData);
            setLoaded(true);
        }

        init();
    }, [savePlacemarks]);

    const selectedMarks = useMemo(
        () => placemarks.filter((mark) => selectedMarksTypes.includes(mark.type)),
        [selectedMarksTypes, placemarks],
    );

    if (!isLoaded) {
        return <div className={styles.loader}>Загрузка...</div>;
    }

    return (
        <>
            <Popup />
            <Filter />
            <MapContainer
                center={position}
                scrollWheelZoom
                attributionControl={null}
                zoomControl={false}
                zoom={DEFAULT_ZOOM}
                className={styles.Map}
            >
                <TileLayer url="https://tile.osmand.net/hd/{z}/{x}/{y}.png" />
                {selectedMarks.map((placemark: MapItem) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Marker key={`${placemark.name},${placemark.coords[0]}${placemark.coords[1]}`} placemark={placemark} />
                ))}
            </MapContainer>
        </>
    );
}

export default MapMainContainer;
