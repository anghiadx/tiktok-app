import classNames from 'classnames/bind';
import styles from './Notify.module.scss';

const cx = classNames.bind(styles);

function Notify({ children }) {
    return (
        <div className={cx('wrapper')}>
            <p className={cx('notify')}>{children}</p>
        </div>
    );
}

export default Notify;
