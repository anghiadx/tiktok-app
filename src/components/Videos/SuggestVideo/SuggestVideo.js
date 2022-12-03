import PropTypes from 'prop-types';
import { useEffect, useState, useContext } from 'react';
import VideoItem from './VideoItem';
import { useLocalStorage } from '~/hooks';
import configs from '~/configs';
import VideoContext from '~/contexts/VideoContext';
import { VideoModalContextKey } from '~/contexts/VideoModalContext';

function SuggestVideo({ data = [] }) {
    // Get data of video modal from Context
    const { propsVideoModal, setPropsVideoModal, videoModalState } = useContext(VideoModalContextKey);
    const [isVideoModalShow] = videoModalState;

    // Local storage
    const videoStorageKey = configs.localStorage.videoControl;
    const [dataStorage, setDataStorage] = useLocalStorage(videoStorageKey);

    // State
    const [videoArray] = useState([]);
    const [volume, setVolume] = useState(dataStorage.volume || 0.6);
    const [muted, setMuted] = useState(true);
    const [priorityVideo, setPriorityVideo] = useState(-1);

    // Set value for context
    const contextValue = {
        volumeState: [volume, setVolume],
        mutedState: [muted, setMuted],
        priorityVideoState: [priorityVideo, setPriorityVideo],
        videoArray: videoArray,
    };

    // Set volume value to localstorage when it changed
    useEffect(() => {
        const data = {
            volume: volume,
        };
        setDataStorage(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volume]);

    // Handle key down event
    useEffect(() => {
        const handleKeyUp = (e) => {
            e.preventDefault();
            const keyCode = e.keyCode;

            switch (keyCode) {
                // key M
                case 77:
                    setMuted(!muted);
                    break;

                // Space & down arrow
                case 32:
                case 40:
                    e.preventDefault();
                    handleScroll('down');
                    break;

                // up arrow
                case 38:
                    e.preventDefault();
                    handleScroll('up');
                    break;

                default:
                    break;
            }
        };
        const handleKeyDown = (e) => {
            const keyCode = e.keyCode;
            const blackList = [40, 38, 32, 77];
            if (blackList.includes(keyCode)) {
                e.preventDefault();
            }
        };
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

    // VIDEO MODAL
    useEffect(() => {
        if (isVideoModalShow) {
            const newProps = {
                handlePrevVideo: () => handleScroll('up'),
                handleNextVideo: () => handleScroll('down'),
            };
            Object.assign(propsVideoModal, newProps);
            setPropsVideoModal({ ...propsVideoModal });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVideoModalShow]);

    // Function
    function handleScroll(type) {
        const fisrtInViewId = videoArray.findIndex((inViewObj) => inViewObj.inView === true);
        const currentVideoId = priorityVideo !== -1 ? priorityVideo : fisrtInViewId;

        if (currentVideoId === -1) {
            return;
        }
        const prevVideo = videoArray[currentVideoId - 1];
        const nextVideo = videoArray[currentVideoId + 1];

        switch (type) {
            case 'up':
                if (prevVideo) {
                    prevVideo.wrapperIntoView();
                    if (isVideoModalShow) {
                        const newProps = {
                            index: prevVideo.id,
                            data: prevVideo.data,
                        };
                        setPropsVideoModal({ ...propsVideoModal, ...newProps });
                    }
                }
                break;

            default:
                if (nextVideo) {
                    nextVideo.wrapperIntoView();
                    if (isVideoModalShow) {
                        const newProps = {
                            index: nextVideo.id,
                            data: nextVideo.data,
                        };
                        setPropsVideoModal({ ...propsVideoModal, ...newProps });
                    }
                }
                break;
        }
    }

    return (
        <VideoContext value={contextValue}>
            {data.map((video, index) => {
                return <VideoItem key={index} videoArray={videoArray} videoInfo={video} videoId={index} />;
            })}
        </VideoContext>
    );
}

SuggestVideo.propTypes = {
    data: PropTypes.array,
};

export default SuggestVideo;
