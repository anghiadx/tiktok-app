import { useState } from 'react';
import { createPortal } from 'react-dom';

function useModal(ModalComponent) {
    const [isShow, setIsShow] = useState(false);

    const modalShow = () => {
        setIsShow(true);
        document.body.classList.add('hidden', 'modal');
    };

    const modalHide = () => {
        setIsShow(false);
        document.body.classList.remove('hidden', 'modal');
    };

    const ModalExport = () => {
        return isShow && createPortal(<ModalComponent handleClose={modalHide} />, document.body);
    };

    return [ModalExport, modalShow];
}

export default useModal;
