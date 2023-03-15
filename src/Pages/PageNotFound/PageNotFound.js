import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './PageNotFound.module.scss';
import LottieIcon from '~/components/LottieIcon';
import { notFoundAnimate } from '~/assets/lotties';
import assetImages from '~/assets/images';
import Button from '~/components/Button';
import SvgIcon from '~/components/SvgIcon';
import { iconPauseVideo } from '~/components/SvgIcon/iconsRepo';
import configs from '~/configs';
import { useLocalStorage } from '~/hooks';

const cx = classNames.bind(styles);

function PageNotFound() {
    const { dataStorage } = useLocalStorage();
    const [animateComplete, setAnimateComplete] = useState(false);
    const lottieOptions = {
        loop: false,
        onComplete: () => {
            setAnimateComplete(true);
        },
    };
    const wrapperStyle = {
        backgroundImage: dataStorage.theme === 'light' ? `url('${assetImages.pageNotFoundBackground}')` : 'none',
    };
    return (
        <div className={cx('wrapper')} style={wrapperStyle}>
            <div className={cx('content', { show: animateComplete })}>
                <LottieIcon
                    className={cx('not-found-icon')}
                    icon={notFoundAnimate}
                    options={lottieOptions}
                ></LottieIcon>
                <p className={cx('title')}>Hiện tại không có trang này</p>
                <div className={cx('suggest-notify')}>
                    <h2>Xem những video thịnh hành khác trên TikTok</h2>
                    <Button
                        to={configs.routes.home}
                        color
                        className={cx('play-now-btn')}
                        leftIcon={<SvgIcon icon={iconPauseVideo} size={18} />}
                    >
                        Xem ngay
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PageNotFound;
