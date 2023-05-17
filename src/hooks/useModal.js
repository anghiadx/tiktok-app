import { useState } from 'react';
import { createPortal } from 'react-dom';

function useModal(ModalComponent) {
    const [isShow, setIsShow] = useState(false);
    const [dataModal, setDataModal] = useState({});

    // typeof data = object
    const modalShow = (data) => {
        setIsShow(true);
        document.body.classList.add('hidden', 'modal');

        // send data to modal component
        data && setDataModal(data);
    };

    const modalHide = () => {
        setIsShow(false);
        document.body.classList.remove('hidden', 'modal');
    };

    const ModalExport = () => {
        return isShow && createPortal(<ModalComponent handleClose={modalHide} {...dataModal} />, document.body);
    };

    return [ModalExport, modalShow];
}

export default useModal;
