import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Forms.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconEyeHide, iconEyeShow, iconWarning } from '~/components/SvgIcon/iconsRepo';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function LoginWithEmail() {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);

    // Input state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleToggleShowPass = () => {
        setShowPass(!showPass);
    };

    const handleChangePassword = (e) => {
        const value = e.target.value;
        const invalidValue = value.includes(' ');
        invalidValue || setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form>
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

            {/* Submit */}
            <Button
                className={cx('submit-btn', { disable: !email || !password })}
                color
                large
                disable={!email || !password}
                onClick={handleSubmit}
            >
                Đăng nhập
            </Button>
        </form>
    );
}

export default LoginWithEmail;
