import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Notify.module.scss';

const cx = classNames.bind(styles);

function Notify({ children, timeout, handleClose }) {
    const [isClose, setIsClose] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClose(true);
        }, timeout);

        return () => {
            clearTimeout(timer);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper')}>
            <p
                className={cx('notify', {
                    'close-notify': isClose,
                })}
                onAnimationEnd={isClose ? handleClose : null}
            >
                {children}
            </p>
        </div>
    );
}

export default Notify;
