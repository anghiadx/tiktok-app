import classNames from 'classnames/bind';
import styles from './LoginNotify.module.scss';
import BorderTopContainer from '~/components/BorderTopContainer';
import Button from '~/components/Button';
import useModal from '~/hooks/useModal';
import { LoginModal } from '~/components/Modals';

const cx = classNames.bind(styles);

function LoginNotify() {
    const [LoginModalComponent, LoginModalComponentToggle] = useModal(LoginModal);
    const currentUser = false;

    return (
        <BorderTopContainer className={cx('login-notify')}>
            <p className={cx('text')}>Đăng nhập để follow các tác giả, thích video và xem bình luận.</p>
            <Button outline large className={cx('login-btn')} onClick={!currentUser ? LoginModalComponentToggle : null}>
                Đăng nhập
            </Button>

            {/* Login Modal */}
            <LoginModalComponent />
        </BorderTopContainer>
    );
}

export default LoginNotify;
