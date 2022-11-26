import PropTypes from 'prop-types';
import { useEffect, useRef, useContext } from 'react';
import classNames from 'classnames/bind';

import styles from './VideoPreview.module.scss';
import { VideoModalContextKey } from '~/contexts/VideoModalContext';

const cx = classNames.bind(styles);

function VideoPreview({ videoId, playIdState, data, modalActive = undefined, children }) {
    const {
        thumb_url: thumbUrl,
        file_url: videoUrl,
        meta: {
            video: { resolution_x: videoWidth, resolution_y: videoHeight },
        },
    } = data;
    const verticalVideo = videoHeight / videoWidth > 1.32;

    // State and ref
    const { videoModalState, setPropsVideoModal } = useContext(VideoModalContextKey);
    const [, videoModalShow] = videoModalState;
    const [idPlay, setIdPlay] = playIdState;
    const videoRef = useRef();

    const isPlaying = videoId === idPlay;

    useEffect(() => {
        isPlaying ? videoRef.current.play() : handleResetVideo();
    });

    const handleHover = () => {
        setTimeout(() => {
            !isPlaying && setIdPlay(videoId);
        }, 150);
    };

    const handleResetVideo = () => {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
    };

    const handleOpenVideoModal = () => {
        const propsVideoModal = {
            index: videoId,
            data: data,
        };
        setPropsVideoModal(propsVideoModal);
        videoModalShow();
    };

    return (
        <header className={cx('video-wrapper')} onMouseOver={handleHover}>
            <div className={cx('inner-content', { vertical: verticalVideo, horizontal: !verticalVideo })}>
                <img src={thumbUrl} alt="" />
                <video
                    src={videoUrl}
                    ref={videoRef}
                    className={cx({ active: isPlaying })}
                    loop
                    muted
                    onClick={modalActive && handleOpenVideoModal}
                ></video>
            </div>
            {children}
        </header>
    );
}

VideoPreview.propTypes = {
    videoId: PropTypes.number,
    playIdState: PropTypes.array,
    data: PropTypes.object,
    modalActive: PropTypes.bool,
    children: PropTypes.node,
};

export default VideoPreview;
