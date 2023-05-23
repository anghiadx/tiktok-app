import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { useSelector, useDispatch } from 'react-redux';

import { toggleMuted, changeMuted, changeVolume } from '~/redux/slices/videoSlice';
import styles from './VideoPlayer.module.scss';
import SvgIcon from '~/components/SvgIcon';
import {
    iconArrowToBot2,
    iconCloseX,
    iconFlag,
    iconMute,
    iconPauseVideo,
    iconVolume,
} from '~/components/SvgIcon/iconsRepo';
import TiktokLoading from '~/components/Loadings/TiktokLoading';
import { timeToPercent, percentToTime, timeFormat } from '~/funcHandler';
import VideoDeletedOverlay from '~/components/Videos/VideoDeletedOverlay';

const cx = classNames.bind(styles);

function VideoPlayer({ index, data = {}, handleClose, handlePrevVideo, handleNextVideo, isDeleted }) {
    // Get video data
    const { thumb_url: thumbUrl, file_url: videoUrl } = data;

    // Redux
    const dispatch = useDispatch();
    const { volume, muted } = useSelector((state) => state.video);

    // This Component's State
    const [playing, setPlaying] = useState(true);
    const [videoStart, setVideoStart] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [progressValue, setProgressValue] = useState(0);

    // Ref
    const videoRef = useRef();
    const volumeBarRef = useRef();
    const volumeDotRef = useRef();

    useEffect(() => {
        if (isDeleted) {
            videoRef.current.pause();
            return;
        }

        playing
            ? videoRef.current.play().catch((err) => {
                  err.code !== 20 && console.error(err);
              })
            : videoRef.current.pause();
    }, [playing, isDeleted]);

    useEffect(() => {
        videoRef.current.muted = muted;
    }, [muted]);

    useEffect(() => {
        const volumeValid = volumeValidate(volume);
        videoRef.current.volume = volumeValid;

        if (muted) {
            volumeBarRef.current.style.width = '0%';
            volumeDotRef.current.style.transform = 'translate(100%, -50%)';
            return;
        }

        // update UI
        let percent = volumeValid * 100;
        volumeBarRef.current.style.width = percent + '%';
        volumeDotRef.current.style.transform = `translate(${100 - percent}%, -50%)`;
    }, [muted, volume]);

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.keyCode === 77) {
                // if there is an open modal then do nothing
                const isModalShow = document.body.classList.contains('modal');
                if (isModalShow) return;

                const action = toggleMuted();
                dispatch(action);
            }
        };
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [muted, dispatch]);

    // == FUNCTION
    const volumeValidate = (volume) => {
        let volumeValid = volume;

        if (volumeValid > 1) {
            volumeValid = 1;
        } else if (volumeValid < 0) {
            volumeValid = 0;
        }

        return volumeValid;
    };

    const togglePlay = () => {
        // Nếu video đã xóa thì không làm gì cả
        if (isDeleted) {
            return;
        }
        setPlaying(!playing);
    };

    const handleToggleMute = () => {
        dispatch(toggleMuted());
    };

    const handleVideoStart = () => {
        !videoStart && setVideoStart(true);
    };

    const handleVolumeChange = (e) => {
        const value = +e.target.value;

        // update volume bar
        volumeBarRef.current.style.width = value + '%';
        volumeDotRef.current.style.transform = `translate(${100 - value}%, -50%)`;

        // Setvolume
        const volumeValid = volumeValidate(value / 100);
        videoRef.current.volume = volumeValid;

        if (value === 0 && !muted) {
            const action = changeMuted(true);
            dispatch(action);
        } else if (value > 0 && muted) {
            const action = changeMuted(false);
            dispatch(action);
        }
    };

    const handleSetVolume = (e) => {
        const value = e.target.value;
        const volumeValid = volumeValidate(value / 100);
        const action = changeVolume(volumeValid);
        dispatch(action);
    };

    const handleClickPrev = (e) => {
        e.stopPropagation();
        handlePrevVideo();
    };

    const handleClickNext = (e) => {
        e.stopPropagation();
        handleNextVideo();
    };

    // Progress control
    const handleTimeUpdate = useCallback(
        function () {
            const currentTime = this.currentTime;
            const percent = timeToPercent(currentTime, totalTime);
            setCurrentTime(currentTime);
            setProgressValue(percent);
        },
        [totalTime],
    );

    const handleProgressActive = () => {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    };

    const handleProgressUnactive = () => {
        videoRef.current.currentTime = currentTime;
        videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    };

    const handleProgressChange = (e) => {
        const percent = +e.target.value;
        const currentTime = percentToTime(percent, totalTime);

        setProgressValue(percent);
        setCurrentTime(currentTime);
    };

    useEffect(() => {
        const video = videoRef.current;
        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [handleTimeUpdate]);

    return (
        <div className={cx('video-player')} onClick={togglePlay}>
            <p className={cx('video__background')} style={{ backgroundImage: `url('${thumbUrl}')` }}></p>

            {/* Video container */}
            <div className={cx('video__space')}>
                <img className={cx({ hidden: videoStart })} src={thumbUrl} alt="" />
                <video
                    src={videoUrl}
                    ref={videoRef}
                    loop
                    onCanPlay={handleVideoStart}
                    onWaiting={() => setLoading(true)}
                    onPlaying={() => setLoading(false)}
                    onLoadedData={(e) => {
                        const totalTime = e.target.duration;
                        setTotalTime(totalTime);
                    }}
                ></video>

                {/* Deleted notify */}
                {isDeleted && <VideoDeletedOverlay />}
            </div>

            {/* Close btn */}
            <button className={cx('btn', 'close-btn')} onClick={() => handleClose('back')}>
                <SvgIcon icon={iconCloseX} size={25} />
            </button>

            {/* Report btn */}
            <button
                className={cx('btn', 'report-btn')}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <SvgIcon icon={iconFlag} size={16} style={{ marginRight: 4 }} />
                Báo cáo
            </button>

            {/* Prev btn */}
            {index !== 0 && !!handlePrevVideo && (
                <button className={cx('btn', 'prev-btn')} onClick={handleClickPrev}>
                    <SvgIcon icon={iconArrowToBot2} size={28} />
                </button>
            )}
            {/* Next btn */}
            {!!handleNextVideo && (
                <button className={cx('btn', 'next-btn')} onClick={handleClickNext}>
                    <SvgIcon icon={iconArrowToBot2} size={28} />
                </button>
            )}

            {/* Volume control */}
            <div className={cx('volume-container')} onClick={(e) => e.stopPropagation()}>
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
                <button className={cx('btn', 'volume-btn')} onClick={handleToggleMute}>
                    {muted ? <SvgIcon icon={iconMute} size={24} /> : <SvgIcon icon={iconVolume} size={24} />}
                </button>
            </div>

            {/* Progress control */}
            {totalTime && (
                <div className={cx('progress-container')} onClick={(e) => e.stopPropagation()}>
                    <div className={cx('progress-control')} style={{ '--progress-data': `${progressValue}%` }}>
                        <div className={cx('progress-bar')}>
                            <div className={cx('progress-dot')}></div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            onChange={handleProgressChange}
                            onMouseDown={handleProgressActive}
                            onMouseUp={handleProgressUnactive}
                            onTouchStart={handleProgressActive}
                            onTouchEnd={handleProgressUnactive}
                        />
                    </div>
                    <p className={cx('progress-time')}>
                        <span>{timeFormat(currentTime)}</span>/<span>{timeFormat(totalTime)}</span>
                    </p>
                </div>
            )}

            {!playing && (
                <span className={cx('play-icon')}>
                    <SvgIcon icon={iconPauseVideo} size={70} />
                </span>
            )}

            {loading && <SvgIcon className={cx('loading')} icon={<TiktokLoading medium />} />}
        </div>
    );
}

VideoPlayer.propTypes = {
    index: PropTypes.number,
    data: PropTypes.object,
    handleClose: PropTypes.func,
    handlePrevVideo: PropTypes.func,
    handleNextVideo: PropTypes.func,
};

export default VideoPlayer;
