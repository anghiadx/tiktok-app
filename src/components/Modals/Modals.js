import { useRef } from 'react';
import useModal from '~/hooks/useModal';
import { LoginModal, KeyboardModal, DownloadMobileModal } from '~/components/Modals';
import ModalContext from '~/contexts/ModalContext';

function Modals({ children }) {
    const [LoginModalComponent, loginModalShow] = useModal(LoginModal);
    const [KeyboardModalComponent, keyboardModalShow] = useModal(KeyboardModal);
    const [DownloadMobileModalComponent, downloadMobileModalShow] = useModal(DownloadMobileModal);

    const contextValue = useRef({
        loginModalShow,
        keyboardModalShow,
        downloadMobileModalShow,
    });

    return (
        <ModalContext value={contextValue.current}>
            {children}

            <LoginModalComponent />
            <KeyboardModalComponent />
            <DownloadMobileModalComponent />
        </ModalContext>
    );
}

export default Modals;
