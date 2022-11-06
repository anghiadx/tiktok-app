import classNames from 'classnames/bind';
import styles from './Forms.module.scss';
import assetImages from '~/assets/images';
import SvgIcon from '~/components/SvgIcon';
import { iconFollow, iconScanQR } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function LoginWithQR() {
    return (
        <div className={cx('LoginQR-container')}>
            <div className={cx('left-space')}>
                <div className={cx('QR')}>
                    <img src={assetImages.exampleQR} alt="QR" />
                </div>
                <div className={cx('step-list')}>
                    <p className={cx('step-item')}>1. Mở ứng dụng TikTok trên thiết bị di động của bạn</p>
                    <p className={cx('step-item')}>
                        2. Trên Hồ sơ, nhấn vào <SvgIcon className={cx('icon')} icon={iconFollow} />
                    </p>
                    <p className={cx('step-item')}>
                        3. Nhấn vào <SvgIcon className={cx('icon')} icon={iconScanQR} /> rồi quét mã QR để xác nhận
                        thông tin đăng nhập của bạn
                    </p>
                </div>
            </div>
            <div className={cx('right-space')}>
                <img src={assetImages.loginWithQRGuide} alt="Guide" />
            </div>
        </div>
    );
}

export default LoginWithQR;
