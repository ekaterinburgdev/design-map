import React, { useContext, useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { Filter } from 'components/Filter/Filter';
import { COORDS_EKATERINBURG } from 'common/constants/coords';
import { MapItem } from 'common/types/map-item';
import { checkIsMobile } from 'common/isMobile';

import { Copyright } from 'components/Copyright/Copyright';
import { Marker } from '../Marker';
import { MapContext } from '../providers/MapProvider';
import { Popup } from '../Popup';

import styles from './MapMainContainer.module.css';
import 'leaflet/dist/leaflet.css';

const DEFAULT_ZOOM = checkIsMobile() ? 12 : 15;

const tileServer = `https://tiles.ekaterinburg.city/styles/basic-black/{z}/{x}/{y}${window.devicePixelRatio > 1 ? '@2x' : ''}.png`;

interface Props {
    placemarksData: MapItem[];
    // eslint-disable-next-line react/require-default-props
    showFilterHeading?: boolean;
}

function MapMainContainer({ placemarksData, showFilterHeading = true }: Props) {
    const position: [number, number] = COORDS_EKATERINBURG;
    const {
        placemarks, popup, selectedMarksTypes, savePlacemarks, openPopup, closePopup,
    } = useContext(MapContext);

    useEffect(() => {
        async function init() {
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: iconRetinaUrl.src,
                iconUrl: iconUrl.src,
                shadowUrl: shadowUrl.src,
            });

            savePlacemarks(placemarksData);
        }

        init();
    }, [savePlacemarks, placemarksData]);

    const selectedMarks: (MapItem & { isOpen: boolean })[] = useMemo(
        () => placemarks
            .filter((mark) => selectedMarksTypes.includes(mark.properties.type))
            .map((m) => ({ ...m, isOpen: m.properties.id === popup?.properties.id })),
        [placemarks, selectedMarksTypes, popup?.properties.id],
    );

    return (
        <>
            <Popup />
            <Filter showHeading={showFilterHeading} />
            <MapContainer
                center={position}
                scrollWheelZoom
                attributionControl={false}
                zoomControl={false}
                zoom={DEFAULT_ZOOM}
                className={styles.Map}
            >
                <TileLayer url={tileServer} />
                {selectedMarks.map((placemark) => (
                    <Marker
                        key={placemark.properties.id}
                        id={placemark.properties.id}
                        type={placemark.properties.type}
                        name={placemark.properties.name}
                        x={placemark.geometry.coordinates[0]}
                        y={placemark.geometry.coordinates[1]}
                        preview={placemark?.properties.images[0].s.src || null}
                        isOpen={placemark.isOpen}
                        openPopup={openPopup}
                        closePopup={closePopup}
                    />
                ))}
            </MapContainer>

            <Copyright />
        </>
    );
}

export default MapMainContainer;
