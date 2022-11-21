import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import classNames from 'classnames/bind';

import styles from './VideoControl.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconFlag, iconMute, iconPauseVideo, iconPlayVideo, iconVolume } from '~/components/SvgIcon/iconsRepo';
import TiktokLoading from '~/components/Loadings/TiktokLoading';
import { VideoContextKey } from '~/contexts/VideoContext';

const cx = classNames.bind(styles);

function VideoControl({ videoId, videoInfo }) {
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
    const { volumeState, mutedState, inViewArrState, priorityVideoState } = useContext(VideoContextKey);

    // STATE
    const [playing, setPlaying] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userInteracting, setUserInteracting] = useState(false);

    const [volume, setVolume] = volumeState;
    const [muted, setMuted] = mutedState;
    const [inViewArr, setInViewArr] = inViewArrState;
    const [priorityVideo, setPriorityVideo] = priorityVideoState;

    // INVIEW STATE
    const [inViewRef, isInView] = useInView({ threshold: 0.5 });

    // REF
    const videoRef = useRef(null);
    const volumeBarRef = useRef(null);
    const volumeDotRef = useRef(null);

    useEffect(() => {
        playing && setDefaultStatus(false);
        playing ? videoRef.current.play() : videoRef.current.pause();
    }, [playing]);

    useEffect(() => {
        videoRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        videoRef.current.muted = muted;
    }, [muted]);

    useEffect(() => {
        volumeDotRef.current.style.height = muted ? '0%' : `${volume * 100}%`;
    }, [volume, muted]);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (priorityVideo !== -1 && videoId !== priorityVideo) {
            playing && handleResetVideo();
            return;
        }

        if (isInView && !userInteracting) {
            const activeId = findFirstInViewId();
            videoId === activeId ? setPlaying(true) : handleResetVideo();
        }
    });

    // FUNCTION
    const updateInViewArr = () => {
        inViewArr[0][videoId].inView = isInView;
        setInViewArr([...inViewArr]);
    };

    const findFirstInViewId = () => {
        const firstInViewId = inViewArr[0].findIndex((obj) => obj.inView === true);
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
        setMuted(!muted);
    };

    const handleResetVideo = () => {
        // reset time
        videoRef.current.currentTime = 0;
        setPlaying(false);
        setDefaultStatus(true);
        setUserInteracting(false);
    };

    const handleChangeVolume = (e) => {
        const layerOrigin = e.nativeEvent.layerY;
        const fullHeight = volumeBarRef.current.offsetHeight;
        let activeHeight = fullHeight - layerOrigin;
        let percent = (100 / fullHeight) * activeHeight;

        // Set height for dot
        volumeDotRef.current.style.height = `${percent}%`;

        // Set height when mousemove activate
        volumeBarRef.current.onmousemove = (e) => {
            const layerMove = e.layerY;
            if (layerMove === layerOrigin) return;

            activeHeight = fullHeight - e.layerY;

            if (activeHeight < 0) {
                setMuted(true);
                return;
            } else if (activeHeight >= fullHeight) {
                activeHeight = fullHeight;
            } else {
                muted && setMuted(false);
            }

            percent = (100 / fullHeight) * activeHeight;

            volumeDotRef.current.style.height = `${percent}%`;
            videoRef.current.volume = percent / 100;
        };

        // Remove mousemove when mouse up or mouse leave outside
        volumeBarRef.current.onmouseup = volumeBarRef.current.onmouseleave = () => {
            volumeBarRef.current.onmousemove = null;

            let volumeRatio = percent / 100;
            let isMute = false;

            if (volumeRatio <= 0) {
                volumeRatio = 0;
                isMute = true;
            } else if (volumeRatio > 1) {
                volumeRatio = 1;
            }

            setVolume(volumeRatio);
            setMuted(isMute);
        };
    };
    return (
        <div className={cx('player-space', directionVideoClass)}>
            <p className={cx('default-space')}></p>
            {loading && playing && <SvgIcon className={cx('video-loading')} icon={<TiktokLoading medium />} />}
            <img className={cx('thumb')} src={thumbUrl} alt="" ref={inViewRef} />
            <video
                className={cx('video', {
                    hidden: defaultStatus,
                })}
                loop
                onWaiting={() => setLoading(true)}
                onPlaying={() => setLoading(false)}
                ref={videoRef}
            >
                <source src={videoUrl} />
            </video>

            {/* Video Control */}
            <button className={cx('control', 'report-btn')}>
                <SvgIcon icon={iconFlag} />
                <span>Báo cáo</span>
            </button>

            <button className={cx('control', 'play-control')} onClick={handleTogglePlayBtn}>
                {playing ? <SvgIcon icon={iconPlayVideo} size={20} /> : <SvgIcon icon={iconPauseVideo} size={20} />}
            </button>

            {muted ? (
                <button className={cx('control', 'volume-btn', 'mute')} onClick={handleVolumeBtn}>
                    <SvgIcon icon={iconMute} size={24} />
                </button>
            ) : (
                <button className={cx('control', 'volume-btn')} onClick={handleVolumeBtn}>
                    <SvgIcon icon={iconVolume} size={24} />
                </button>
            )}

            <div className={cx('volume-control')}>
                <div className={cx('volume-bar')} ref={volumeBarRef} onMouseDown={handleChangeVolume}>
                    <div className={cx('volume-dot')} ref={volumeDotRef}></div>
                </div>
            </div>
        </div>
    );
}

VideoControl.propTypes = {
    videoId: PropTypes.number,
    videoInfo: PropTypes.object.isRequired,
};

export default VideoControl;
