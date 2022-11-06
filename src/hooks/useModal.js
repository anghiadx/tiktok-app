import { useState } from 'react';
import { createPortal } from 'react-dom';

function useModal(modal) {
    const [isShow, setIsShow] = useState(false);

    const toggleShow = () => {
        setIsShow(!isShow);
    };

    return [Modal(modal, isShow, toggleShow), toggleShow];
}

function Modal(modal, isShow, toggleShow) {
    const ModalComp = modal;
    return () => isShow && createPortal(<ModalComp onClose={toggleShow} />, document.body);
}

export default useModal;
