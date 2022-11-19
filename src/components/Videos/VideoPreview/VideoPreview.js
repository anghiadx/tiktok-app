import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';

import styles from './VideoPreview.module.scss';

const cx = classNames.bind(styles);

function VideoPreview({ videoId, thumbUrl, videoUrl, vertical = false, playIdState, children }) {
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

    return (
        <header className={cx('video-wrapper')} onMouseOver={handleHover}>
            <div className={cx('inner-content', { vertical: vertical, horizontal: !vertical })}>
                <img src={thumbUrl} alt="" />
                <video src={videoUrl} ref={videoRef} className={cx({ active: isPlaying })} loop muted></video>
            </div>
            {children}
        </header>
    );
}

VideoPreview.propTypes = {
    videoId: PropTypes.number,
    thumbUrl: PropTypes.string,
    videoUrl: PropTypes.string,
    vertical: PropTypes.bool,
    playIdState: PropTypes.array,
    children: PropTypes.node,
};

export default VideoPreview;
