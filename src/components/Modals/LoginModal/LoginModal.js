/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './LoginModal.module.scss';
import { ModalWrapper } from '~/components/Modals';
import SvgIcon from '~/components/SvgIcon';
import { iconArrowLeft, iconArrowToBot2, iconCloseX } from '~/components/SvgIcon/iconsRepo';
import Button from '~/components/Button';
import { loginModalData, registerModalData } from '~/temp/data/modals';

const cx = classNames.bind(styles);

function LoginModal({ handleClose }) {
    const [isClose, setIsClose] = useState(false);
    const [tabList, setTabList] = useState([loginModalData]);
    const [registering, setRegistering] = useState(false);
    const [fullRegisterList, setFullRegisterList] = useState(false);

    let currentTab = tabList[tabList.length - 1];

    // Handle when click close btn
    const handleCloseModal = () => {
        setIsClose(true);
    };

    // Handle data of currentTab while in registration status
    if (registering && !fullRegisterList) {
        const isArray = Array.isArray(currentTab.data);
        if (isArray) {
            currentTab = { ...currentTab };
            currentTab.data = currentTab.data.slice(0, 3);
        }
    }

    const handleGoChildrenTab = (loginItem) => {
        const hasChildren = !!loginItem.children;

        if (hasChildren) {
            setTabList([...tabList, loginItem.children]);
        }
    };

    const handleBackChildrenTab = () => {
        const newTabList = [...tabList];
        newTabList.pop();
        setTabList(newTabList);
    };

    const handleGoToRegister = () => {
        setTabList([registerModalData]);
        setRegistering(true);
    };

    const handleGoToLogin = () => {
        setTabList([loginModalData]);
        setRegistering(false);
        setFullRegisterList(false);
    };

    return (
        <ModalWrapper className={cx('modal-wrapper')} isClose={isClose} onClose={handleClose}>
            {/* Close btn */}
            <button className={cx('close-btn')} onClick={handleCloseModal}>
                <SvgIcon icon={iconCloseX} />
            </button>

            {/* Back btn */}
            {tabList.length > 1 && (
                <button className={cx('back-btn')} onClick={handleBackChildrenTab}>
                    <SvgIcon icon={iconArrowLeft} />
                </button>
            )}

            {/* BODY */}
            <section className={cx('body')}>
                <h1 className={cx('login-title')}>{currentTab.title}</h1>
                {currentTab.type === 'component' ? (
                    <currentTab.data />
                ) : (
                    currentTab.data.map((loginItem, index) => (
                        <Button
                            key={index}
                            primary
                            leftIcon={loginItem.icon}
                            className={cx('login-item', { disable: loginItem.disable })}
                            iconClassName={cx('icon')}
                            textClassName={cx('text')}
                            disable={loginItem.disable}
                            onClick={() => handleGoChildrenTab(loginItem)}
                        >
                            {loginItem.title}
                        </Button>
                    ))
                )}

                {registering && !fullRegisterList && tabList.length === 1 && (
                    <div className={cx('show-full-register-list')} onClick={() => setFullRegisterList(true)}>
                        <SvgIcon icon={iconArrowToBot2} />
                    </div>
                )}
            </section>

            {/* terms of registration */}
            {registering && (
                <div className={cx('term-registration')}>
                    <p>
                        Bằng cách tiếp tục, bạn đồng ý với
                        <a href="#" target={'_blank'} rel="noreferrer">
                            Điều khoản Sử dụng
                        </a>
                        của TikTok và xác nhận rằng bạn đã đọc hiểu
                        <a href="#" target={'_blank'} rel="noreferrer">
                            Chính sách Quyền riêng tư
                        </a>
                        của TikTok.
                    </p>
                </div>
            )}

            {/* Footer */}
            <footer className={cx('footer')}>
                {registering ? 'Bạn đã có tài khoản?' : 'Bạn không có tài khoản?'}
                <span className={cx('register-btn')} onClick={registering ? handleGoToLogin : handleGoToRegister}>
                    {registering ? 'Đăng nhập' : 'Đăng ký'}
                </span>
            </footer>
        </ModalWrapper>
    );
}

LoginModal.propTypes = {
    handleClose: PropTypes.func,
};

export default LoginModal;
