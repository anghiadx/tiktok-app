import PropTypes from 'prop-types';
import { useEffect, useState, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMuted } from '~/redux/slices/videoSlice';
import VideoItem from './VideoItem';
import { useLocalStorage } from '~/hooks';
import VideoContext from '~/contexts/VideoContext';
import { VideoModalContextKey } from '~/contexts/VideoModalContext';

function SuggestVideo({ data = [] }) {
    // Get data of video modal from Context
    const { propsVideoModal, setPropsVideoModal, videoModalState } = useContext(VideoModalContextKey);
    const [isVideoModalShow] = videoModalState;

    // Local storage
    const { setDataStorage } = useLocalStorage();

    // Redux
    const dispatch = useDispatch();
    const { volume } = useSelector((state) => state.video);

    // State
    const [priorityVideo, setPriorityVideo] = useState(-1);

    // Ref
    const videoArrayRef = useRef([]);

    // Set value for context
    const contextValue = {
        priorityVideoState: [priorityVideo, setPriorityVideo],
        videoArray: videoArrayRef.current,
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
            // if there is an open modal then do nothing
            const isModalShow = document.body.classList.contains('modal');
            if (isModalShow) return;

            e.preventDefault();
            const keyCode = e.keyCode;

            switch (keyCode) {
                // key M
                case 77:
                    dispatch(toggleMuted());
                    break;

                // Space & down arrow
                case 32:
                case 40:
                    handleScroll('down');
                    break;

                // up arrow
                case 38:
                    handleScroll('up');
                    break;

                default:
                    break;
            }
        };
        const handleKeyDown = (e) => {
            // if there is an open modal then do nothing
            const isModalShow = document.body.classList.contains('modal');
            if (isModalShow) return;

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
        const fisrtInViewId = videoArrayRef.current.findIndex((inViewObj) => inViewObj.inView === true);
        const currentVideoId = priorityVideo !== -1 ? priorityVideo : fisrtInViewId;

        if (currentVideoId === -1) {
            return;
        }

        switch (type) {
            case 'up':
                let prevVideo;

                // Get prevVideo
                for (let i = currentVideoId - 1; i >= 0; i--) {
                    const currentVideo = videoArrayRef.current[i];
                    const isDeleted = Boolean(currentVideo?.data?.isDeleted);

                    if (!isDeleted) {
                        prevVideo = currentVideo;
                        break;
                    }
                }

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
                let nextVideo;

                // Get nextVideo
                for (let i = currentVideoId + 1; i < videoArrayRef.current.length; i++) {
                    const currentVideo = videoArrayRef.current[i];
                    const isDeleted = Boolean(currentVideo?.data?.isDeleted);

                    if (!isDeleted) {
                        nextVideo = currentVideo;
                        break;
                    }
                }

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
                return <VideoItem key={index} videoArray={videoArrayRef.current} videoInfo={video} videoId={index} />;
            })}
        </VideoContext>
    );
}

SuggestVideo.propTypes = {
    data: PropTypes.array,
};

export default SuggestVideo;
