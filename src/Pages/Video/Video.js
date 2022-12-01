import { useEffect } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from './Video.module.scss';
import configs from '~/configs';

const cx = classNames.bind(styles);

function Video() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(configs.routes.home, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className={cx('wrapper')}></div>;
}

export default Video;
