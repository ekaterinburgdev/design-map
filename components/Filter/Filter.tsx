import classNames from 'classnames';
import React, { useState } from 'react';
import styles from './Filter.module.css';

export function Filter() {
    const [isOpen, setOpen] = useState(false);

    const toggle = () => setOpen(!isOpen);

    const items = [
        { name: 'Логотипы и айдентика', count: 2, color: '#E63223' },
        { name: 'Навигационные стелы', count: 12, color: '#E63223' },
        { name: 'Таблички ОКН', count: 65, color: '#FFd400' },
        { name: 'Таблички ЧО', count: 6, color: '#FF640A' },
        { name: 'Обычные адресные таблички', count: 5, color: '#FF640A' },
        { name: 'Фризы остановок', count: 8, color: '#FFd400' },
        { name: 'Светофор', count: 2, color: '#E63223' },
        { name: 'Исторические адресные таблички', count: 5, color: '#E63223' },
        { name: 'Уличная мебель', count: 1, color: '#00b400' },
        { name: 'Памятные таблички', count: 1, color: '#00b4ff' },
        { name: 'Транспорт', count: 1, color: '#00b4ff' },
        { name: 'Настенные таблички', count: 21, color: '#00b400' },
    ];

    const all = items.reduce((all, item) => all + item.count, 0);

    return (
        <div className={styles.filter}>
            <div className={styles.filter__name} onClick={toggle}>
                <div>
                    Карта объектов дизайн-кода
                    <div className={styles['filter__name-counter']}>Всего {all}</div>
                </div>
                <img
                    className={classNames(styles.filter__arrow, {
                        [styles.filter__arrow_open]: isOpen,
                    })}
                    src="/arrow.svg"
                />
            </div>
            <div
                className={classNames(styles.filter__list, {
                    [styles.filter__list_open]: isOpen,
                })}
            >
                <div className={styles.filter__wrapper}>
                    {items.map((item) => (
                        <label className={styles.checkbox} key={item.name}>
                            <input
                                className={styles.checkbox__input}
                                type="checkbox"
                                name="islands#darkOrangeCircleDotIcon"
                                defaultChecked={true}
                            />
                            <span
                                className={styles.checkbox__caption}
                                style={{ color: item.color }}
                            >
                                <span className={styles['checkbox__caption-label']}>
                                    {item.name}
                                </span>
                                <span className={styles['checkbox__caption-counter']}>
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
