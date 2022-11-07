import { useState } from 'react';
import { createPortal } from 'react-dom';

function useModal(modal) {
    const [isShow, setIsShow] = useState(false);

    const modalShow = () => {
        setIsShow(true);
        document.body.classList.add('hidden');
    };

    const modalHide = () => {
        setIsShow(false);
        document.body.classList.remove('hidden');
    };

    return [Modal(modal, isShow, modalHide), modalShow];
}

function Modal(modal, isShow, modalHide) {
    const ModalComp = modal;
    return () => isShow && createPortal(<ModalComp handleClose={modalHide} />, document.body);
}

export default useModal;
