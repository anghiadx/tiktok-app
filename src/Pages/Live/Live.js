import { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Live.module.scss';
import LiveLoading from '~/components/Loadings/LiveLoading';

const cx = classNames.bind(styles);

function Live() {
    const wrapperRef = useRef();

    useEffect(() => {
        wrapperRef.current.scrollIntoView({ block: 'start' });
    }, []);

    return (
        <div ref={wrapperRef} className={cx('wrapper')}>
            <LiveLoading />
        </div>
    );
}

export default Live;
