/* eslint-disable @next/next/no-img-element */
import React from 'react';
import classNames from 'classnames';
import { MapItem } from 'common/types/map-item';
import { useCopyHref } from 'components/helpers/useCopyHref';
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
                <div className={styles.popup__coords}>
                    {placemark.coords[0]}
                    {' '}
                    {placemark.coords[1]}
                </div>
                <h2 className={styles.popup__title}>{placemark.name}</h2>
                {placemark.street && (
                    <address className={styles.popup__address}>{placemark.street}</address>
                )}
                <button
                    type="button"
                    className={
                        classNames(styles.popup__share, {
                            [styles.popup__share_copied]: isCopied,
                        })
                    }
                    onClick={onCopy}
                    disabled={isCopied}
                >
                    {isCopied ? 'Скопировано' : 'Скопировать ссылку на объект'}
                </button>
            </div>
            <div className={styles.popup__info}>
                <Info placemark={placemark} />
            </div>
            <div className={styles.popup__images}>
                {placemark.images.map((src) => (
                    <img
                        key={src.id}
                        src={src.m.src}
                        width={src.m.width}
                        height={src.m.height}
                        className={styles.popup__image}
                        alt={placemark.name}
                    />
                ))}
            </div>
        </div>
    );
}
