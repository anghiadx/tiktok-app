import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useContext, memo } from 'react';
import { useInView } from 'react-intersection-observer';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';

import { toggleMuted, changeMuted, changeVolume } from '~/redux/slices/videoSlice';
import styles from './VideoControl.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconFlag, iconMute, iconPauseVideo, iconPlayVideo, iconVolume } from '~/components/SvgIcon/iconsRepo';
import TiktokLoading from '~/components/Loadings/TiktokLoading';
import { VideoContextKey } from '~/contexts/VideoContext';
import { VideoModalContextKey } from '~/contexts/VideoModalContext';
import Img from '~/components/Img';
import assetImages from '~/assets/images/images';

const cx = classNames.bind(styles);

function VideoControl({ videoId, videoInfo, setThumbLoaded, onClick:handleOpenVideoModal }) {
    // Get data from video info
    const {
        thumb_url: thumbUrl,
        file_url: videoUrl,
        meta: {
            video: { resolution_x: videoWidth, resolution_y: videoHeight },
        },
    } = videoInfo;

    const directionVideoClass = videoWidth - videoHeight < 0 ? 'vertical' : 'horizontal';

    // Get data from the context
    const { videoArray, priorityVideoState } = useContext(VideoContextKey);
    const { videoModalState } = useContext(VideoModalContextKey);
    const [isVideoModalShow] = videoModalState;

    // Redux state
    const dispatch = useDispatch();
    const { volume, muted } = useSelector((state) => state.video);

    // STATE
    const [, setRender] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userInteracting, setUserInteracting] = useState(false);

    const [priorityVideo, setPriorityVideo] = priorityVideoState;

    // INVIEW STATE
    const [inViewRef, isInView] = useInView({ threshold: 0.5 });

    // REF
    const videoRef = useRef(null);
    const volumeBarRef = useRef(null);
    const volumeDotRef = useRef(null);

    useEffect(() => {
        videoArray[videoId].update = setRender;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        playing && setDefaultStatus(false);
        playing
            ? videoRef.current.play().catch((err) => {
                  err.code !== 20 && console.error(err);
              })
            : videoRef.current.pause();
    }, [playing]);

    useEffect(() => {
        const volumeValid = valueValidate(volume, 0, 1);
        videoRef.current.volume = volumeValid;
    }, [volume]);

    useEffect(() => {
        videoRef.current.muted = muted;
    }, [muted]);

    // Update volume UI
    useEffect(() => {
        const volumeValid = valueValidate(volume, 0, 1);

        if (muted) {
            volumeBarRef.current.style.width = '0%';
            volumeDotRef.current.style.transform = 'translate(100%, -50%)';
        } else {
            // update UI
            let percent = volumeValid * 100;

            volumeBarRef.current.style.width = percent + '%';
            volumeDotRef.current.style.transform = `translate(${100 - percent}%, -50%)`;
        }
    }, [volume, muted]);

    // Update inviewArr when inView is changed
    useEffect(() => {
        updateInViewArr();

        if (!isInView) {
            handleResetVideo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView]);

    useEffect(() => {
        userInteracting && window.addEventListener('scroll', handleRemoveInteractive);

        return () => {
            userInteracting && window.removeEventListener('scroll', handleRemoveInteractive);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInteracting]);

    // Handle Video Play Or Not
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if ((priorityVideo !== -1 && videoId !== priorityVideo) || isVideoModalShow) {
            playing && handleResetVideo();
            return;
        }
        if (isInView && !userInteracting) {
            const activeId = findFirstInViewId();
            videoId === activeId ? setPlaying(true) : handleResetVideo();
        }
    });

    // FUNCTION
    const valueValidate = (value, min, max) => {
        let valueValid = value;

        if (valueValid > max) {
            valueValid = max;
        } else if (valueValid < min) {
            valueValid = min;
        }

        return valueValid;
    };

    const updateInViewArr = () => {
        videoArray[videoId].inView = isInView;

        // when the inview status of this video changes -> update the next video
        // (so that next video can play or stop respectively)
        if (videoArray[videoId + 1]?.update) {
            videoArray[videoId + 1].update((prev) => !prev);
        }
    };

    const findFirstInViewId = () => {
        const firstInViewId = videoArray.findIndex((obj) => obj?.inView === true);
        return firstInViewId;
    };

    const handleTogglePlayBtn = () => {
        setPlaying(!playing);
        setUserInteracting(true);

        // Click play btn when video is stoping
        if (!playing) {
            setPriorityVideo(videoId);
        }
    };

    const handleRemoveInteractive = () => {
        setTimeout(() => {
            const activeId = findFirstInViewId();

            videoId !== activeId ? handleResetVideo() : setUserInteracting(false);

            setPriorityVideo(-1);
        }, 250);

        // remove this event right after first run
        window.removeEventListener('scroll', handleRemoveInteractive);
    };

    const handleVolumeBtn = () => {
        dispatch(toggleMuted());
    };

    const handleResetVideo = () => {
        // Reload video and set the states to default
        videoRef.current.load();
        setPlaying(false);
        setDefaultStatus(true);
        setUserInteracting(false);
    };

    const handleVolumeChange = (e) => {
        const value = +e.target.value;
        const valueValid = valueValidate(value, 0, 100);

        // Update UI volume bar
        volumeBarRef.current.style.width = valueValid + '%';
        volumeDotRef.current.style.transform = `translate(${100 - valueValid}%, -50%)`;

        // Set volume of video
        videoRef.current.volume = valueValid / 100;

        valueValid === 0 && !muted && dispatch(changeMuted(true));
        valueValid > 0 && muted && dispatch(changeMuted(false));
    };

    const handleSetVolume = (e) => {
        const value = +e.target.value;
        const valueValid = valueValidate(value, 0, 100);

        const action = changeVolume(valueValid / 100);
        dispatch(action);
    };
    
    return (
        <div className={cx('player-space', directionVideoClass)}>
            {loading && playing && <SvgIcon className={cx('video-loading')} icon={<TiktokLoading medium />} />}
            <div className={cx('default-space')} onClick={handleOpenVideoModal}>
                <Img
                    className={cx('thumb')}
                    src={thumbUrl}
                    ref={inViewRef}
                    fallback={
                        directionVideoClass === 'vertical'
                            ? assetImages.imageTransparentVertical
                            : assetImages.imageTransparentHorizontal
                    }
                    onLoad={() => setThumbLoaded(true)}
                />
                <video
                    ref={videoRef}
                    className={cx('video', {
                        hidden: defaultStatus,
                    })}
                    loop
                    onWaiting={() => setLoading(true)}
                    onPlaying={() => setLoading(false)}
                >
                    <source src={videoUrl} />
                </video>
            </div>

            {/* Video Control */}
            <button className={cx('control', 'report-btn')}>
                <SvgIcon icon={iconFlag} />
                <span>Báo cáo</span>
            </button>

            <button className={cx('control', 'play-control')} onClick={handleTogglePlayBtn}>
                {playing ? <SvgIcon icon={iconPlayVideo} size={20} /> : <SvgIcon icon={iconPauseVideo} size={20} />}
            </button>

            <div className={cx('volume-container')}>
                <div className={cx('volume-control')}>
                    <div className={cx('volume-background')}>
                        <div className={cx('volume-bar')} ref={volumeBarRef}>
                            <div className={cx('volume-dot')} ref={volumeDotRef}></div>
                        </div>
                    </div>

                    <input
                        className={cx('volume-range')}
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        onChange={handleVolumeChange}
                        onMouseUp={handleSetVolume}
                    />
                </div>

                <button className={cx('control', 'volume-btn', { mute: muted })} onClick={handleVolumeBtn}>
                    {muted ? <SvgIcon icon={iconMute} size={24} /> : <SvgIcon icon={iconVolume} size={24} />}
                </button>
            </div>
        </div>
    );
}

VideoControl.propTypes = {
    videoId: PropTypes.number,
    videoInfo: PropTypes.object.isRequired,
    setThumbLoaded: PropTypes.func,
    onClick: PropTypes.func
};

export default memo(VideoControl);
