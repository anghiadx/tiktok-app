import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ModalWrapper from '~/components/Modals';
import styles from './KeyboardModal.module.scss';
import SvgIcon from '~/components/SvgIcon';
import {
    iconCloseX,
    iconKeyboardArrowBottom,
    iconKeyboardArrowTop,
    iconKeyboardL,
    iconKeyboardM,
} from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function KeyboardModal({ onClose }) {
    return (
        <ModalWrapper className={cx('modal-wrapper')}>
            {/* Close btn */}
            <button className={cx('close-btn')} onClick={onClose}>
                <SvgIcon icon={iconCloseX} size={20} />
            </button>
            <h2 className={cx('title')}>Phím tắt trên bàn phím</h2>
            <div className={cx('shortcut-list')}>
                <p className={cx('shortcut-item')}>
                    Quay về video trước <SvgIcon icon={iconKeyboardArrowTop} />
                </p>
                <p className={cx('shortcut-item')}>
                    Đi đến video tiếp theo <SvgIcon icon={iconKeyboardArrowBottom} />
                </p>
                <p className={cx('shortcut-item')}>
                    Thích video <SvgIcon icon={iconKeyboardL} />
                </p>
                <p className={cx('shortcut-item')}>
                    Tắt tiếng / bật tiếng video <SvgIcon icon={iconKeyboardM} />
                </p>
            </div>
        </ModalWrapper>
    );
}

KeyboardModal.propTypes = {
    onClose: PropTypes.func,
};

export default KeyboardModal;
