import { useState } from 'react';
import classNames from 'classnames/bind';
import LottieIcon from '~/components/LottieIcon/LottieIcon';

import { tiktokLikeAnimate } from '~/assets/lotties';
import styles from './VideoInteractive.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconComment, iconHeart } from '~/components/SvgIcon/iconsRepo';
import { likeService } from '~/services';

const cx = classNames.bind(styles);

function VideoInteractive({ isAuth, loginModalShow, videoInfo }) {
    const [isLiked, setIsLiked] = useState(videoInfo.is_liked);

    const handleLikeVideo = () => {
        if (isLiked) {
            likeService.unlikeVideo(videoInfo.id);
            videoInfo.likes_count -= 1;
        } else {
            likeService.likeVideo(videoInfo.id);
            videoInfo.likes_count += 1;
        }

        setIsLiked(!isLiked);
        videoInfo.is_liked = !isLiked;
    };

    return (
        <div className={cx('counts-list')}>
            <div
                className={cx('count-item')}
                style={{ cursor: 'pointer' }}
                onClick={!isAuth ? loginModalShow : handleLikeVideo}
            >
                <span className={cx('count-icon')}>
                    {isAuth && isLiked ? (
                        <LottieIcon className={cx('heart-icon')} icon={tiktokLikeAnimate} options={{ loop: false }} />
                    ) : (
                        <SvgIcon icon={iconHeart} />
                    )}
                </span>
                <strong className={cx('count-title')}>{videoInfo.likes_count}</strong>
            </div>

            <p className={cx('count-item')}>
                <span className={cx('count-icon')}>
                    <SvgIcon icon={iconComment} />
                </span>
                <strong className={cx('count-title')}>{videoInfo.comments_count}</strong>
            </p>
        </div>
    );
}

export default VideoInteractive;
