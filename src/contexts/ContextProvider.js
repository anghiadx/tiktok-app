import ModalProvider from './ModalContext';
import VideoModalProvider from './VideoModalContext';

function ContextProvider({ children }) {
    return (
        <ModalProvider>
            <VideoModalProvider>{children}</VideoModalProvider>
        </ModalProvider>
    );
}

export default ContextProvider;
