import { useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './Switch.module.scss';

const cx = classNames.bind(styles);

function Switch({ isOn, handleToggle, className }) {
    const inputId = useMemo(() => `input-${Math.floor(Math.random() * 10000)}`, []);

    return (
        <div>
            <input type="checkbox" id={inputId} className={cx('input')} hidden checked={isOn} onChange={handleToggle} />
            <label className={cx('switch', { [className]: className })} htmlFor={inputId}></label>
        </div>
    );
}

export default Switch;
