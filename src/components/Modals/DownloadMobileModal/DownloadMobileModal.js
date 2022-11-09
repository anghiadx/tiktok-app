/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './DownloadMobileModal.module.scss';
import ModalWrapper from '../ModalWrapper';
import assetImages from '~/assets/images';
import SvgIcon from '~/components/SvgIcon';
import { iconCloseX } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function DownloadMobileModal({ handleClose }) {
    const [isClose, setIsClose] = useState(false);

    const handleCloseModal = () => {
        setIsClose(true);
    };

    return (
        <ModalWrapper
            className={cx('modal-wrapper')}
            isClose={isClose}
            onClose={handleClose}
            animateEnd="hidden-effect-fade"
        >
            <button className={cx('close-btn')} onClick={handleCloseModal}>
                <SvgIcon icon={iconCloseX} size={24} />
            </button>
            <h2 className={cx('big-title')}>Tải ứng dụng TikTok</h2>

            <div className={cx('download-with-qr')}>
                <h3 className={cx('title')}>Hãy quét mã QR để tải TikTok về máy</h3>
                <div className={cx('qr-space')}>
                    <img src={assetImages.exampleQR} alt="QR code" />
                </div>
            </div>

            <div className={cx('download-with-store')}>
                <h3 className={cx('title')}>Tải về từ cửa hàng ứng dụng</h3>
                <div className={cx('store-list')}>
                    <a className={cx('store-item')} href="#" target="_blank" rel="noreferrer">
                        <img src={assetImages.downloadWithMicrosoft} alt="Download with Microsoft" />
                    </a>
                    <a className={cx('store-item')} href="#" target="_blank" rel="noreferrer">
                        <img src={assetImages.downloadWithAppstore} alt="Download with Appstore" />
                    </a>
                    <a className={cx('store-item')} href="#" target="_blank" rel="noreferrer">
                        <img src={assetImages.downloadWithAmazon} alt="Download with Amazon appstore" />
                    </a>
                    <a className={cx('store-item')} href="#" target="_blank" rel="noreferrer">
                        <img src={assetImages.downloadWithGooglePlay} alt="Download with Google Play" />
                    </a>
                </div>
            </div>
        </ModalWrapper>
    );
}

DownloadMobileModal.propTypes = {
    handleClose: PropTypes.func,
};

export default DownloadMobileModal;
