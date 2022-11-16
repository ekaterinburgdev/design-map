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
                            <path d="M8.46447 15.5355L15.5355 8.46446" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M8.46447 8.46447L15.5355 15.5355" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </Sheet.Header>
                <Sheet.Content>{children}</Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={close} />
        </Sheet>
    );
}
