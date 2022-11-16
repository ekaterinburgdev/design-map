import React, { useContext, useMemo } from 'react';
import { Modal } from 'components/Modal';
import { isMobile } from 'common/isMobile';
import { MapContext } from '../MapProvider';
import { PopupContent } from './PopupContent';

export function Popup() {
    const { popup, closePopup } = useContext(MapContext);

    const size = useMemo(() => {
        const mobileSize = popup?.images?.length ? 0.85 : 0.50;
        const desktopSize = 100;

        return isMobile ? mobileSize : desktopSize;
    }, [popup?.images?.length]);

    return (
        <Modal size={size} isOpen={!!popup} close={closePopup}>
            <PopupContent placemark={popup} />
        </Modal>
    );
}
