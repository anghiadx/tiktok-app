import classNames from 'classnames/bind';
import styles from './Live.module.scss';
import LiveLoading from '~/components/Loadings/LiveLoading';

const cx = classNames.bind(styles);

function Live() {
    return (
        <div className={cx('wrapper')}>
            <LiveLoading />
        </div>
    );
}

export default Live;
