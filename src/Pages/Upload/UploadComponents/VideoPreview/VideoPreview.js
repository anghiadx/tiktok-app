import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './VideoPreview.module.scss';
import assetImages from '~/assets/images';
import { timeToPercent, percentToTime, timeFormat } from '~/funcHandler';
import SvgIcon from '~/components/SvgIcon/SvgIcon';
import { iconTickCircle } from '~/components/SvgIcon/iconsRepo';
import { ModalContextKey } from '~/contexts/ModalContext';

const cx = classNames.bind(styles);

function VideoPreview({ file, setFile, videoDescription, videoMusic, currentUser }) {
    // State
    const [videoUrl, setVideoUrl] = useState('');
    const [progressValue, setProgressValue] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMute, setIsMute] = useState(false);

    const handleTimeUpdate = useCallback(
        function () {
            const currentTime = this.currentTime;
            const percent = timeToPercent(currentTime, totalTime);

            setCurrentTime(currentTime);
            percent && setProgressValue(percent);
        },
        [totalTime],
    );

    // Context
    const { confirmModalShow } = useContext(ModalContextKey);

    // Create video url from file
    useEffect(() => {
        if (!file) {
            return;
        }
        const videoUrl = URL.createObjectURL(file);
        setVideoUrl(videoUrl);

        return () => {
            URL.revokeObjectURL(videoUrl);
        };
    }, [file]);

    // Play / pause video
    useEffect(() => {
        if (!totalTime) {
            return;
        }
        isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }, [isPlaying, totalTime]);

    // Muted / unmuted
    useEffect(() => {
        if (!totalTime) {
            return;
        }

        videoRef.current.muted = isMute;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMute]);

    useEffect(() => {
        const video = videoRef.current;
        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [handleTimeUpdate]);

    // Ref
    const videoRef = useRef();
    const videoHeight = useRef(1);
    const videoWidth = useRef(1);

    const videoHorizontal = videoWidth.current / videoHeight.current >= 1;

    const confirmChangeVideo = () => {
        const dataConfirm = {
            content: (
                <div className={cx('confirm-modal-content')}>
                    <h2>Thay thế video này?</h2>
                    <p>Chú thích và cài đặt vẫn sẽ được lưu.</p>
                </div>
            ),

            apply: (
                <p className={cx('confirm-modal-apply')} onClick={() => setFile(null)}>
                    Thay thế
                </p>
            ),
            cancel: <p className={cx('confirm-modal-cancel')}>Tiếp tục chỉnh sửa</p>,
        };

        confirmModalShow(dataConfirm);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('phone-container')}>
                {/* Video UI */}
                <div className={cx('video-space')}>
                    <video
                        ref={videoRef}
                        className={cx({ horizontal: videoHorizontal })}
                        src={videoUrl}
                        onLoadedData={(e) => {
                            const video = e.target;
                            const totalTime = video.duration;
                            totalTime && setTotalTime(totalTime);

                            // Update video width, height
                            videoHeight.current = video.videoHeight;
                            videoWidth.current = video.videoWidth;
                        }}
                        onEnded={() => {
                            isPlaying && setIsPlaying(false);
                        }}
                    ></video>
                </div>

                {/* Overlay UI */}
                <div className={cx('overlay-space')}>
                    <header>
                        <img src={assetImages.liveIcon} alt="" />
                        <div className={cx('header-text')}>
                            <span>Đang Follow</span>
                            <span>Dành cho bạn</span>
                        </div>
                        <img src={assetImages.searchIcon} alt="" />
                    </header>

                    <section>
                        <div className={cx('section-right')}>
                            <p style={{ backgroundImage: `url('${currentUser.avatar}')` }}></p>
                            <img src={assetImages.interactiveIcon} alt="" />
                            <p></p>
                        </div>

                        <div className={cx('section-left')}>
                            <p className={cx('username')}>{currentUser.nickname}</p>
                            <p className={cx('description')}>{videoDescription}</p>
                            <div className={cx('music')}>
                                <div className={cx('music-bar')}>
                                    <p className={cx('music-thumb')}>
                                        <span>{videoMusic}</span>
                                        <span>{videoMusic}</span>
                                        <span>{videoMusic}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer></footer>
                </div>

                {/* Control */}
                <div className={cx('control-space')} onClick={() => setIsPlaying(!isPlaying)}>
                    <section>
                        {/* Time */}
                        <div className={cx('time-control')}>
                            <button
                                className={cx('play-btn', {
                                    playing: isPlaying,
                                })}
                            ></button>
                            <p className={cx('time-show')}>
                                <span>{timeFormat(currentTime)}</span> / <span>{timeFormat(totalTime)}</span>
                            </p>
                            <button
                                className={cx('mute-btn', {
                                    mute: isMute,
                                })}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMute(!isMute);
                                }}
                            ></button>
                        </div>

                        {/* Progress */}
                        <div className={cx('progress-control')} onClick={(e) => e.stopPropagation()}>
                            <div className={cx('pro-bar')} style={{ '--progress-data': `${progressValue}%` }}>
                                <p className={cx('pro-dot')}></p>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                onChange={(e) => {
                                    const percent = +e.target.value;
                                    const currentTime = percentToTime(percent, totalTime);

                                    setProgressValue(percent);
                                    setCurrentTime(currentTime);
                                }}
                                onMouseDown={() => {
                                    videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                                }}
                                onMouseUp={() => {
                                    videoRef.current.currentTime = currentTime;
                                    videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
                                }}
                            />
                        </div>
                    </section>
                </div>
            </div>

            <div className={cx('change-video-container')}>
                <SvgIcon className={cx('icon')} icon={iconTickCircle} size={16} />
                <p>{file.name}</p>
                <span></span>
                <strong onClick={confirmChangeVideo}>Thay đổi video</strong>
            </div>
        </div>
    );
}

export default VideoPreview;
