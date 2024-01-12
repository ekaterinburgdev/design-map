import React from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { useCopyHref } from 'components/helpers/useCopyHref';
import { MapItem } from 'common/types/map-item';
import styles from './Popup.module.css';
import { Info } from './components/Info';

interface Props {
    placemark: MapItem;
}

export function PopupContent({ placemark }: Props) {
    const { isCopied, onCopy } = useCopyHref(window.location.href);

    return (
        <div className={styles.popup}>
            <div className={styles.popup__content}>
                <div className={styles.popup__header}>
                    <div className={classNames(styles.popup__headeritem, styles.popup__coords)}>
                        {placemark.geometry.coordinates[0]?.toFixed(6)}
                        {', '}
                        {placemark.geometry.coordinates[1]?.toFixed(6)}
                    </div>
                    <button
                        type="button"
                        className={
                            classNames(styles.popup__share, styles.popup__headeritem, {
                                [styles.popup__share_copied]: isCopied,
                            })
                        }
                        onClick={onCopy}
                        disabled={isCopied}
                    >
                        {isCopied ? 'Скопировано' : 'Скопировать ссылку на объект'}
                    </button>
                </div>
                <h2 className={styles.popup__title}>{placemark.properties.name}</h2>
                {placemark.properties.street && (
                    <address className={styles.popup__address}>
                        {placemark.properties.street}
                    </address>
                )}
                <div className={styles.popup__info}>
                    <Info
                        type={placemark.properties.type}
                        name={placemark.properties.name}
                        description={placemark.properties.description}
                    />
                </div>
            </div>
            <div className={styles.popup__images}>
                {placemark.properties.images.map((src) => (
                    <a href={src.m.src} target="_blank" rel="noreferrer">
                        <Image
                            key={src.m.src}
                            src={src.m.src}
                            width={src.m.width}
                            height={src.m.height}
                            className={styles.popup__image}
                            alt={placemark.properties.name}
                        />
                    </a>
                ))}
            </div>
        </div>
    );
}
