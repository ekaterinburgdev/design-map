/* eslint-disable @next/next/no-img-element */
import React, { ReactNode, useEffect } from 'react';
import Sheet from 'react-modal-sheet';
import styles from './Modal.module.css';

interface Props {
    children: ReactNode;
    isOpen: boolean;
    close: VoidFunction;
    // eslint-disable-next-line react/require-default-props
    size?: number;
}

export function Modal({
    isOpen, close, size = 0.8, children,
}: Props) {
    useEffect(() => {
        const onKeyup = (e: KeyboardEvent) => {
            if (isOpen && e.key === 'Escape') {
                close();
            }
        };

        window.addEventListener('keyup', onKeyup);

        return () => {
            window.removeEventListener('keyup', onKeyup);
        };
    }, [isOpen, close]);

    return (
        <Sheet
            snapPoints={[size, 0]}
            isOpen={isOpen}
            onClose={close}
        >
            <Sheet.Container>
                <Sheet.Header>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={close}
                        className={styles.close}
                    >
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.0659 8.99469C16.3588 8.70179 16.3588 8.22692 16.0659 7.93403C15.773 7.64113 15.2981 7.64113 15.0052 7.93403L12 10.9392L8.99482 7.93403C8.70192 7.64113 8.22705 7.64113 7.93416 7.93403C7.64126 8.22692 7.64126 8.70179 7.93416 8.99469L10.9394 11.9999L7.93415 15.0051C7.64125 15.298 7.64125 15.7729 7.93415 16.0658C8.22704 16.3586 8.70191 16.3586 8.99481 16.0658L12 13.0605L15.0052 16.0658C15.2981 16.3586 15.773 16.3586 16.0659 16.0658C16.3588 15.7729 16.3588 15.298 16.0659 15.0051L13.0607 11.9999L16.0659 8.99469Z" fill="currentColor" />
                        </svg>
                    </button>
                </Sheet.Header>
                <Sheet.Content>{children}</Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={close} />
        </Sheet>
    );
}
