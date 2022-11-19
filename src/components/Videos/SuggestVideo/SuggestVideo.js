import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import VideoItem from './VideoItem';
import VideoContext from '~/contexts/VideoContext';
import useLocalStorage from '~/hooks/useLocalStorage';
import configs from '~/configs';

function SuggestVideo({ data }) {
    const videoStorageKey = configs.localStorage.videoControl;
    const [dataStorage, setDataStorage] = useLocalStorage(videoStorageKey);

    // State
    const [volume, setVolume] = useState(dataStorage.volume || 0.6);
    const [muted, setMuted] = useState(true);
    const [inViewArr, setInViewArr] = useState([[]]);
    const [priorityVideo, setPriorityVideo] = useState(-1);

    // Set value for context
    const contextValue = {
        volumeState: [volume, setVolume],
        mutedState: [muted, setMuted],
        inViewArrState: [inViewArr, setInViewArr],
        priorityVideoState: [priorityVideo, setPriorityVideo],
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
        const handleScrollTo = (type) => {
            const fisrtInViewId = inViewArr[0].findIndex((inViewObj) => inViewObj.inView === true);

            const currentVideoId = priorityVideo !== -1 ? priorityVideo : fisrtInViewId;

            if (currentVideoId === -1) {
                return;
            }

            const prevVideo = inViewArr[0][currentVideoId - 1];
            const nextVideo = inViewArr[0][currentVideoId + 1];

            const optionsValue = {
                block: 'start',
                behavior: 'smooth',
            };

            if (type === 'down') {
                nextVideo && nextVideo.wrapperIntoView(optionsValue);
            } else if (type === 'up') {
                prevVideo && prevVideo.wrapperIntoView(optionsValue);
            }
        };

        const handleKeyDown = (e) => {
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
                    handleScrollTo('down');
                    break;

                // up arrow
                case 38:
                    e.preventDefault();
                    handleScrollTo('up');
                    break;

                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [muted, inViewArr, priorityVideo]);

    return (
        <VideoContext value={contextValue}>
            {data.map((video, index) => {
                return <VideoItem key={index} inViewArr={inViewArr[0]} videoInfo={video} videoId={index} />;
            })}
        </VideoContext>
    );
}

SuggestVideo.propTypes = {
    data: PropTypes.array,
};

export default SuggestVideo;
