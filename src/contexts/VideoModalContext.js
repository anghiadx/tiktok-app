import { createContext } from 'react';
import { useVideoModal } from '~/hooks';
import { VideoModal } from '~/components/Modals';

export const VideoModalContextKey = createContext();

function VideoModalContext({ children }) {
    // Video modal
    const { VideoModalComponent, videoModalState, propsVideoModal, setPropsVideoModal } = useVideoModal(VideoModal);

    const contextValue = { videoModalState, propsVideoModal, setPropsVideoModal };
    return (
        <VideoModalContextKey.Provider value={contextValue}>
            {children}
            <VideoModalComponent />
        </VideoModalContextKey.Provider>
    );
}

export default VideoModalContext;
