import { useContext, useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import LottieIcon from '~/components/LottieIcon/LottieIcon';

import { tiktokLikeAnimate } from '~/assets/lotties';
import styles from './InteractiveVideo.module.scss';
import SvgIcon from '~/components/SvgIcon/SvgIcon';
import { iconHeart, iconComment, iconShare } from '~/components/SvgIcon/iconsRepo';
import { ModalContextKey } from '~/contexts/ModalContext';
import SharePopper from '~/components/Shares/SharePopper';
import dataTemp from '~/temp/data';
import { likeService } from '~/services';

const cx = classNames.bind(styles);

function InteractiveVideo({ isAuth, handleOpenVideoModal, videoInfo }) {
    const { loginModalShow } = useContext(ModalContextKey);

    // get data from temp data
    const { videoShares } = dataTemp.shares;

    // State
    const [isLiked, setIsLiked] = useState(videoInfo.is_liked);

    // Ref
    const heartIconRef = useRef();

    useEffect(() => {
        if (isLiked !== videoInfo.is_liked) {
            setIsLiked(videoInfo.is_liked);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoInfo.is_liked === isLiked]);

    useEffect(() => {
        isLiked && heartIconRef.current.setSpeed(1.5);
    }, [isLiked]);

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
        <div className={cx('interactive-space')}>
            {/* Like video */}
            <label className={cx('interactive-item')}>
                <div className={cx('item-icon')} onClick={!isAuth ? loginModalShow : handleLikeVideo}>
                    {isAuth && isLiked ? (
                        <LottieIcon
                            ref={heartIconRef}
                            className={cx('heart-icon')}
                            icon={tiktokLikeAnimate}
                            options={{ loop: false }}
                        />
                    ) : (
                        <SvgIcon icon={iconHeart} />
                    )}
                </div>
                <strong className={cx('item-count')}>{videoInfo.likes_count}</strong>
            </label>

            {/* Comment video */}
            <label className={cx('interactive-item')}>
                <div className={cx('item-icon')} onClick={!isAuth ? loginModalShow : handleOpenVideoModal}>
                    <SvgIcon icon={iconComment} />
                </div>
                <strong className={cx('item-count')}>{videoInfo.comments_count}</strong>
            </label>

            {/* Share video */}
            <SharePopper data={videoShares}>
                <label className={cx('interactive-item')}>
                    <div className={cx('item-icon')}>
                        <SvgIcon icon={iconShare} />
                    </div>
                    <strong className={cx('item-count')}>{videoInfo.shares_count || 'Chia sẻ'}</strong>
                </label>
            </SharePopper>
        </div>
    );
}

export default InteractiveVideo;
