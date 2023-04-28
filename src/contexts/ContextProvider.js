import ModalProvider from './ModalContext';
import VideoModalProvider from './VideoModalContext';
import NotifyProvider from './NotifyContext';

function ContextProvider({ children }) {
    return (
        <NotifyProvider>
            <ModalProvider>
                <VideoModalProvider>{children}</VideoModalProvider>
            </ModalProvider>
        </NotifyProvider>
    );
}

export default ContextProvider;
