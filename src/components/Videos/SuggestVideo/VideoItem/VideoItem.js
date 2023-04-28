/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import { memo, useContext, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import styles from './VideoItem.module.scss';
import Button from '~/components/Button';
import Img from '~/components/Img';
import SvgIcon from '~/components/SvgIcon';
import { iconComment, iconHeart, iconMusic, iconShare } from '~/components/SvgIcon/iconsRepo';
import ShowTick from '~/components/ShowTick';
import AccountPreview from '~/components/Items/AccountItem/AccountPreview';
import VideoControl from '../VideoControl';
import SharePopper from '~/components/Shares/SharePopper';
import HashtagFilter from '~/components/Filters/HashtagFilter';
import dataTemp from '~/temp/data';

import { ModalContextKey } from '~/contexts/ModalContext';
import { VideoModalContextKey } from '~/contexts/VideoModalContext';
import { VideoContextKey } from '~/contexts/VideoContext';

const cx = classNames.bind(styles);

function VideoItem({ videoId, videoInfo }) {
    // Get Modal context value
    const { loginModalShow } = useContext(ModalContextKey);
    const { videoArray, priorityVideoState } = useContext(VideoContextKey);
    const { videoModalState, setPropsVideoModal } = useContext(VideoModalContextKey);
    const [, setPriorityVideo] = priorityVideoState;
    const [, videoModalShow] = videoModalState;

    // State
    const [thumbLoaded, setThumbLoaded] = useState(false);


    // ref
    const wrapperRef = useRef();

    // get data from temp data
    const { videoShares } = dataTemp.shares;

    const { isAuth } = useSelector((state) => state.auth);

    // Get data from video info
    const {
        user: {
            avatar: avatarUrl,
            nickname: userName,
            first_name: firstName,
            last_name: lastName,
            tick,
            bio,
            followers_count: followerCount,
            likes_count: likeCount,
        },
        description,
        music: musicInfo,
        likes_count: likesCount,
        comments_count: commentsCount,
        shares_count: sharesCount,
    } = videoInfo;

    useLayoutEffect(() => {
        const optionsScroll = {
            block: 'start',
            behavior: 'smooth',
        };

        videoArray[videoId] = {
            id: videoId,
            data: videoInfo,
            wrapperIntoView: wrapperRef.current.scrollIntoView.bind(wrapperRef.current, optionsScroll),
            inView: null,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Handle open video modal
    const handleOpenVideoModal = () => {
        // if having video priority -> reset about -1
        setPriorityVideo(-1);
        // put the video to the top of inview
        videoArray[videoId].wrapperIntoView();

        const propsVideoModal = {
            index: videoId,
            data: videoInfo,
        };
        setPropsVideoModal(propsVideoModal);
        videoModalShow();
    };

    return (
        <div ref={wrapperRef} className={cx('wrapper')}>
            <Link className={cx('big-avatar')} to={'/@' + userName}>
                <AccountPreview
                    avatarUrl={avatarUrl}
                    userName={userName}
                    fullName={`${firstName} ${lastName}`}
                    tick={tick}
                    bio={bio}
                    followerCount={followerCount}
                    likeCount={likeCount}
                    customTippy={{ delay: [1000, 500], offset: [0, 6] }}
                >
                    <Img className={cx('avatar')} src={avatarUrl} />
                </AccountPreview>
            </Link>
            <div className={cx('body')}>
                <div className={cx('video-info')}>
                    {/* User info */}
                    <AccountPreview
                        avatarUrl={avatarUrl}
                        userName={userName}
                        fullName={`${firstName} ${lastName}`}
                        tick={tick}
                        bio={bio}
                        followerCount={followerCount}
                        likeCount={likeCount}
                        customTippy={{ delay: [1000, 250], offset: [0, 16] }}
                    >
                        <Link className={cx('user-info')} to={'/@' + userName}>
                            <Img className={cx('avatar', 'small-avatar')} src={avatarUrl} />
                            <p className={cx('name')}>
                                <span className={cx('user-name')}>
                                    {userName} <ShowTick tick={tick} />
                                </span>
                                <span className={cx('full-name')}>{`${firstName} ${lastName}`}</span>
                            </p>
                        </Link>
                    </AccountPreview>
                    <Button outline className={cx('follow-btn')} onClick={!isAuth ? loginModalShow : null}>
                        Follow
                    </Button>

                    {/* Description  */}
                    <p className={cx('description')}>
                        <HashtagFilter>{description}</HashtagFilter>
                    </p>

                    {/* Music info */}
                    <a href="#" className={cx('music-info')}>
                        <SvgIcon className={cx('icon-music')} icon={iconMusic} />
                        {musicInfo || `Nhạc nền - ${firstName} ${lastName}`}
                    </a>
                </div>

                <div className={cx('video-player')}>
                    {/* Video container */}
                    <VideoControl videoInfo={videoInfo} videoId={videoId} setThumbLoaded={setThumbLoaded} onClick={handleOpenVideoModal} />

                    {/* Interactive container */}
                    {thumbLoaded && (
                        <div className={cx('interactive-space')}>
                            {/* Like video */}
                            <label className={cx('interactive-item')}>
                                <button className={cx('item-icon')} onClick={!isAuth ? loginModalShow : null}>
                                    <SvgIcon icon={iconHeart} />
                                </button>
                                <strong className={cx('item-count')}>{likesCount}</strong>
                            </label>

                            {/* Comment video */}
                            <label className={cx('interactive-item')}>
                                <button className={cx('item-icon')} onClick={!isAuth ? loginModalShow : handleOpenVideoModal}>
                                    <SvgIcon icon={iconComment} />
                                </button>
                                <strong className={cx('item-count')}>{commentsCount}</strong>
                            </label>

                            {/* Share video */}
                            <SharePopper data={videoShares}>
                                <label className={cx('interactive-item')}>
                                    <button className={cx('item-icon')}>
                                        <SvgIcon icon={iconShare} />
                                    </button>
                                    <strong className={cx('item-count')}>{sharesCount || 'Chia sẻ'}</strong>
                                </label>
                            </SharePopper>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

VideoItem.propTypes = {
    videoId: PropTypes.number,
    videoInfo: PropTypes.object.isRequired,
};

export default memo(VideoItem);
