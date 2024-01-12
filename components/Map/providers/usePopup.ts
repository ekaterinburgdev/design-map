import {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { MapItem, MapItemProperties } from 'common/types/map-item';

type PopupId = MapItemProperties['id'];

export function usePopup(placemarks: MapItem[]) {
    const [popupId, setOpenedPopup] = useState<PopupId>(null);

    const openPopup = useCallback((id: PopupId) => {
        window.location.hash = id;
    }, []);

    const closePopup = useCallback(() => {
        window.location.hash = '';
    }, []);

    const popup = useMemo(
        () => placemarks.find((p) => p.properties.id === popupId),
        [placemarks, popupId],
    );

    useEffect(() => {
        function onHashChange() {
            setOpenedPopup(window.location.hash.slice(1));
        }

        window.addEventListener('hashchange', onHashChange, false);

        return () => {
            window.removeEventListener('hashchange', onHashChange, false);
        };
    }, [setOpenedPopup]);

    useEffect(() => {
        document.title = popup?.properties.name || 'Карта дизайн-кода Екатеринбурга';
    }, [popup]);

    useEffect(() => {
        setOpenedPopup(window.location.hash.slice(1));
    }, []);

    return {
        popup,
        openPopup,
        closePopup,
    };
}
