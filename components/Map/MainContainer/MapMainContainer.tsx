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
    const objectId = window.location.hash.slice(1);
    const matchedObject = objectId && placemarksData.find((p) => p.id === objectId);
    const position: [number, number] = matchedObject
        ? [matchedObject.coords[0], matchedObject.coords[1]] : COORDS_EKATERINBURG;

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
            .filter((mark) => selectedMarksTypes.includes(mark.type))
            .map((m) => ({ ...m, isOpen: m.id === popup?.id })),
        [placemarks, selectedMarksTypes, popup?.id],
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
                        key={placemark.id}
                        id={placemark.id}
                        type={placemark.type}
                        name={placemark.name}
                        x={placemark.coords[0]}
                        y={placemark.coords[1]}
                        preview={placemark?.preview?.s?.src || null}
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
