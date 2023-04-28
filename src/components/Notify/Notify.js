import classNames from 'classnames/bind';
import styles from './Notify.module.scss';

const cx = classNames.bind(styles);

function Notify({ children }) {
    return (
        <p className={cx('wrapper')}>
            <p className={cx('notify')}>{children}</p>
        </p>
    );
}

export default Notify;
