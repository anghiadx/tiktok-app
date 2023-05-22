import { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import LottieIcon from '~/components/LottieIcon/LottieIcon';

import { tiktokLikeAnimate } from '~/assets/lotties';
import styles from './VideoInteractive.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconComment, iconHeart } from '~/components/SvgIcon/iconsRepo';
import { likeService } from '~/services';
import { NotifyContextKey } from '~/contexts/NotifyContext';

const cx = classNames.bind(styles);

function VideoInteractive({ isAuth, loginModalShow, videoInfo }) {
    const [isLiked, setIsLiked] = useState(videoInfo.is_liked);

    // Context
    const showNotify = useContext(NotifyContextKey);

    const handleLikeVideo = async () => {
        setIsLiked(!isLiked);
        videoInfo.is_liked = !isLiked;

        let dataResponse;
        if (isLiked) {
            videoInfo.likes_count -= 1;
            dataResponse = await likeService.unlikeVideo(videoInfo.id);
        } else {
            videoInfo.likes_count += 1;
            dataResponse = await likeService.likeVideo(videoInfo.id);
        }

        if (!dataResponse) {
            if (isLiked) {
                videoInfo.likes_count += 1;
            } else {
                videoInfo.likes_count -= 1;
            }

            setIsLiked(isLiked);
            videoInfo.is_liked = isLiked;
            showNotify('Không thể tương tác. Vui lòng thử lại!');
        }
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
