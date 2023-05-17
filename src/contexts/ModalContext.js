import { createContext, useRef } from 'react';
import { useModal } from '~/hooks';
import { LoginModal, KeyboardModal, DownloadMobileModal, UpdateProfileModal, ConfirmModal } from '~/components/Modals';

export const ModalContextKey = createContext();

function ModalContext({ children }) {
    const [LoginModalComponent, loginModalShow] = useModal(LoginModal);
    const [KeyboardModalComponent, keyboardModalShow] = useModal(KeyboardModal);
    const [DownloadMobileModalComponent, downloadMobileModalShow] = useModal(DownloadMobileModal);
    const [UpdateProfileModalComponent, updateProfileModalShow] = useModal(UpdateProfileModal);
    const [ConfirmModalComponent, confirmModalShow] = useModal(ConfirmModal);

    const contextValue = useRef({
        loginModalShow,
        keyboardModalShow,
        downloadMobileModalShow,
        updateProfileModalShow,
        confirmModalShow,
    });

    return (
        <ModalContextKey.Provider value={contextValue.current}>
            {children}

            <LoginModalComponent />
            <KeyboardModalComponent />
            <DownloadMobileModalComponent />
            <UpdateProfileModalComponent />
            <ConfirmModalComponent />
        </ModalContextKey.Provider>
    );
}

export default ModalContext;
