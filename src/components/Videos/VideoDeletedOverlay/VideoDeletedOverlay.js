import classNames from 'classnames/bind';
import styles from './VideoDeletedOverlay.module.scss';

const cx = classNames.bind(styles);

function VideoDeletedOverlay({ className }) {
    return (
        <div
            className={cx('wrapper', {
                [className]: className,
            })}
        >
            <p className={cx('notify')}>Video đã bị xóa!</p>
        </div>
    );
}

export default VideoDeletedOverlay;
