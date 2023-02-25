import { useState } from 'react';
import { createPortal } from 'react-dom';

function useVideoModal(ModalComponent) {
    const [isVideoModalShow, setIsVideoModalShow] = useState(false);
    const [propsVideoModal, setPropsVideoModal] = useState({});
    const [urlStart, setUrlStart] = useState('/#/');

    const videoModalShow = () => {
        setIsVideoModalShow(true);
        document.body.classList.add('video-modal');

        // Location change
        const { pathname, hash, search } = window.location;
        const urlOrigin = pathname + hash + search;
        setUrlStart(urlOrigin);
    };

    const modalHide = (type) => {
        setIsVideoModalShow(false);
        document.body.classList.remove('video-modal');
        window.history.replaceState(null, '', urlStart);
    };

    const VideoModalComponent = () => {
        return (
            isVideoModalShow &&
            createPortal(<ModalComponent handleClose={modalHide} {...propsVideoModal} />, document.body)
        );
    };

    return {
        VideoModalComponent,
        propsVideoModal,
        setPropsVideoModal,
        videoModalState: [isVideoModalShow, videoModalShow],
    };
}

export default useVideoModal;
