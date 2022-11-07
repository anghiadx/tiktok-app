import { useRef } from 'react';
import useModal from '~/hooks/useModal';
import { LoginModal, KeyboardModal } from '~/components/Modals';
import ModalContext from '~/contexts/ModalContext';

function Modals({ children }) {
    const [LoginModalComponent, LoginModalShow] = useModal(LoginModal);
    const [KeyboardModalComponent, KeyboardModalShow] = useModal(KeyboardModal);

    const contextValue = useRef({
        LoginModalShow,
        KeyboardModalShow,
    });

    return (
        <ModalContext value={contextValue.current}>
            {children}

            <LoginModalComponent />
            <KeyboardModalComponent />
        </ModalContext>
    );
}

export default Modals;
