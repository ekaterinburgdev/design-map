import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './Filter.module.css';

export function Filter() {
    const [isOpen, setOpen] = useState(false);

    const toggle = () => setOpen(!isOpen);
    const onKeyUp = (e) => {
        if (e.key === 'Enter') {
            toggle();
        }
    };

    const items = [
        {
            name: 'Логотипы и айдентика',
            checked: true,
            count: 2,
            color: '#E63223',
        },
        {
            name: 'Навигационные стелы',
            checked: true,
            count: 12,
            color: '#E63223',
        },
        {
            name: 'Таблички ОКН',
            checked: true,
            count: 65,
            color: '#FFd400',
        },
        {
            name: 'Таблички ЧО',
            checked: true,
            count: 6,
            color: '#FF640A',
        },
        {
            name: 'Обычные адресные таблички',
            checked: true,
            count: 5,
            color: '#FF640A',
        },
        {
            name: 'Фризы остановок',
            checked: true,
            count: 8,
            color: '#FFd400',
        },
        {
            name: 'Светофор',
            checked: true,
            count: 2,
            color: '#E63223',
        },
        {
            name: 'Исторические адресные таблички',
            checked: true,
            count: 5,
            color: '#E63223',
        },
        {
            name: 'Уличная мебель',
            checked: true,
            count: 1,
            color: '#00b400',
        },
        {
            name: 'Памятные таблички',
            checked: true,
            count: 1,
            color: '#00b4ff',
        },
        {
            name: 'Транспорт',
            checked: true,
            count: 1,
            color: '#00b4ff',
        },
        {
            name: 'Настенные таблички',
            checked: true,
            count: 21,
            color: '#00b400',
        },
    ];

    const count = items.reduce((all, item) => all + item.count, 0);

    return (
        <div className={styles.filter}>
            <div
                className={styles.filter__control}
                tabIndex={0}
                role="button"
                onClick={toggle}
                onKeyUp={onKeyUp}
            >
                <div>
                    <h1 className={styles.filter__header}>Карта объектов дизайн-кода</h1>
                    <div className={styles.filter__counter}>
                        <span>Всего </span>
                        {count}
                    </div>
                </div>
                <img
                    className={classNames(styles.filter__arrow, {
                        [styles.filter__arrow_open]: isOpen,
                    })}
                    src="/arrow.svg"
                    alt=""
                />
            </div>
            <div
                className={classNames(styles.filter__list, {
                    [styles.filter__list_open]: isOpen,
                })}
            >
                <div className={styles.filter__wrapper}>
                    {items.map((item) => (
                        <label className={styles.filteritem} key={item.name} htmlFor={item.name}>
                            <input
                                className={styles.filteritem__input}
                                type="checkbox"
                                defaultChecked={item.checked}
                                id={item.name}
                            />
                            <span
                                className={styles.filteritem__caption}
                                style={{ color: item.color }}
                            >
                                <span className={styles['filteritem__caption-label']}>
                                    {item.name}
                                </span>
                                <span className={styles['filteritem__caption-counter']}>
                                    {item.count}
                                </span>
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
