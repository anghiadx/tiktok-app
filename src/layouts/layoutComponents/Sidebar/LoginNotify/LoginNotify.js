import { useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './LoginNotify.module.scss';
import BorderTopContainer from '~/components/BorderTopContainer';
import Button from '~/components/Button';
import { ModalContextKey } from '~/contexts/ModalContext';

const cx = classNames.bind(styles);

function LoginNotify() {
    const { loginModalShow } = useContext(ModalContextKey);

    const currentUser = false;

    return (
        <BorderTopContainer className={cx('login-notify')}>
            <p className={cx('text')}>Đăng nhập để follow các tác giả, thích video và xem bình luận.</p>
            <Button outline large className={cx('login-btn')} onClick={!currentUser ? loginModalShow : null}>
                Đăng nhập
            </Button>
        </BorderTopContainer>
    );
}

export default LoginNotify;
