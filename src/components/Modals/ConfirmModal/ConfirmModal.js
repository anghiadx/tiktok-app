import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ConfirmModal.module.scss';
import ModalWrapper from '../ModalWrapper';

const cx = classNames.bind(styles);

function ConfirmModal({ handleClose, content, apply, cancel }) {
    const [isClose, setIsClose] = useState(false);

    return (
        <ModalWrapper className={cx('wrapper')} isClose={isClose} onClose={handleClose}>
            <section className={cx('content')}>{content || 'Xác nhận?'}</section>
            <footer onClick={() => setIsClose(true)}>
                <div className={cx('apply')}>{apply || 'OK'}</div>
                <div className={cx('cancel')}>{cancel || 'Cancel'}</div>
            </footer>
        </ModalWrapper>
    );
}

export default ConfirmModal;
