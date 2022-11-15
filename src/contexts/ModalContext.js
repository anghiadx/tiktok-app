import { createContext, useRef } from 'react';
import useModal from '~/hooks/useModal';
import { LoginModal, KeyboardModal, DownloadMobileModal } from '~/components/Modals';

export const ModalContextKey = createContext();

function ModalContext({ children }) {
    const [LoginModalComponent, loginModalShow] = useModal(LoginModal);
    const [KeyboardModalComponent, keyboardModalShow] = useModal(KeyboardModal);
    const [DownloadMobileModalComponent, downloadMobileModalShow] = useModal(DownloadMobileModal);

    const contextValue = useRef({
        loginModalShow,
        keyboardModalShow,
        downloadMobileModalShow,
    });

    return (
        <ModalContextKey.Provider value={contextValue.current}>
            {children}

            <LoginModalComponent />
            <KeyboardModalComponent />
            <DownloadMobileModalComponent />
        </ModalContextKey.Provider>
    );
}

export default ModalContext;
