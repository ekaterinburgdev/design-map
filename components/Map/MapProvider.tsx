import React, {
    ReactNode, useCallback, useMemo, useState,
} from 'react';
import { uniqBy } from 'lodash';
import { MapItem, MapItemType } from 'common/types/map-item';

type PopupId = MapItem['name'];
interface IMapContext {
    placemarks: MapItem[];
    savePlacemarks: (marks: MapItem[]) => void;
    allMarksTypes: MapItemType[];
    selectedMarksTypes: MapItemType[];
    filterMarks: (items: MapItemType[]) => void;
    popup: MapItem | null;
    openPopup: (id: PopupId) => void;
    closePopup: VoidFunction;
}

export const MapContext = React.createContext<IMapContext>({
    placemarks: [],
    savePlacemarks: () => {},
    allMarksTypes: [],
    selectedMarksTypes: [],
    filterMarks: () => {},
    popup: null,
    openPopup: () => {},
    closePopup: () => {},
});

interface Props {
    children: ReactNode;
}

const getUniqTypes = (all: MapItem[]) => uniqBy(all, (mark) => mark.type).map((m) => m.type);

export function MapContextProvider({ children }: Props) {
    const [placemarks, setMarks] = useState<MapItem[]>([]);
    const [openedPopup, setOpenedPopup] = useState<PopupId>(null);
    const [selectedMarksTypes, setSelectedMarks] = useState<MapItemType[]>([]);

    const filterMarks = useCallback(
        (items: MapItemType[]) => setSelectedMarks(items),
        [setSelectedMarks],
    );

    const savePlacemarks = useCallback(
        (items: MapItem[]) => {
            setMarks(items);
            setSelectedMarks(getUniqTypes(items));
        },
        [setMarks],
    );

    const allMarksTypes = useMemo(() => getUniqTypes(placemarks), [placemarks]);

    const openPopup = useCallback((id: PopupId) => setOpenedPopup(id), []);
    const closePopup = useCallback(() => setOpenedPopup(null), []);
    const popup = useMemo(
        () => placemarks.find((p) => p.name === openedPopup),
        [placemarks, openedPopup],
    );

    const value = useMemo(
        () => ({
            placemarks,
            savePlacemarks,
            allMarksTypes,
            selectedMarksTypes,
            filterMarks,
            popup,
            openPopup,
            closePopup,
        }),
        [
            placemarks,
            savePlacemarks,
            allMarksTypes,
            selectedMarksTypes,
            filterMarks,
            popup,
            openPopup,
            closePopup,
        ],
    );

    return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
