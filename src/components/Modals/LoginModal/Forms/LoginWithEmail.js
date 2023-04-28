import { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import styles from './Forms.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconEyeHide, iconEyeShow, iconWarning } from '~/components/SvgIcon/iconsRepo';
import Button from '~/components/Button';
import { login } from '~/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { NotifyContextKey } from '~/contexts/NotifyContext';

const cx = classNames.bind(styles);

function LoginWithEmail() {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    // Input state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Redux
    const dispatch = useDispatch();

    // Context
    const showNotify = useContext(NotifyContextKey);

    const handleToggleShowPass = () => {
        setShowPass(!showPass);
    };

    const handleChangePassword = (e) => {
        const value = e.target.value;
        const invalidValue = value.includes(' ');
        invalidValue || setPassword(e.target.value);
        error && setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = JSON.stringify({
            email: email,
            password: password,
        });

        setLoading(true);
        const action = await dispatch(login(loginData));
        setLoading(false);

        if (action.payload.message) {
            !error && setError('Thông tin email hoặc mật khẩu không chính xác!');
        } else {
            showNotify('Đăng nhập thành công!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className={cx('form-header')}>
                <label className={cx('title')}>Email hoặc TikTok ID</label>
            </div>

            {/* Email */}
            <div className={cx('form-input')}>
                <input
                    type="text"
                    value={email}
                    placeholder="Email hoặc TikTok ID"
                    onChange={(e) => {
                        setEmail(e.target.value);
                        error && setError('');
                    }}
                />
            </div>

            {/* Password */}
            <div className={cx('form-input', { warning: !!error })}>
                <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    placeholder="Mật khẩu"
                    onChange={handleChangePassword}
                />
                {!!error && (
                    <span className={cx('warning-icon')}>
                        <SvgIcon icon={iconWarning} />
                    </span>
                )}
                <span className={cx('show-password-btn')} onClick={handleToggleShowPass}>
                    {showPass ? <SvgIcon icon={iconEyeShow} /> : <SvgIcon icon={iconEyeHide} />}
                </span>
            </div>

            <div className={cx('message')}>{error}</div>

            <span className={cx('forgot-password')}>Quên mật khẩu?</span>

            {/* Submit btn */}
            <Button
                className={cx('submit-btn', { disable: !email || !password })}
                color
                large
                disable={!email || !password || loading}
            >
                {!loading ? 'Đăng nhập' : <FontAwesomeIcon className={cx('loading-icon')} icon={faCircleNotch} />}
            </Button>
        </form>
    );
}

export default LoginWithEmail;
