import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Forms.module.scss';
import Button from '~/components/Button';
import SvgIcon from '~/components/SvgIcon';
import { iconWarning, iconEyeShow, iconEyeHide, iconTickBox } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function RegisterWithEmail() {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);

    // Input state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

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
                <label className={cx('title')}>Email</label>
            </div>

            {/* Email */}
            <div className={cx('form-input')}>
                <input
                    type="text"
                    value={email}
                    placeholder="Địa chỉ email"
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

            {/* Re-Password */}
            <div className={cx('form-input', { warning: !!error })}>
                <input
                    type={showPass ? 'text' : 'password'}
                    value={rePassword}
                    placeholder="Nhập lại mật khẩu"
                    onChange={(e) => {
                        setRePassword(e.target.value);
                    }}
                />
                {!!error && (
                    <span className={cx('warning-icon')}>
                        <SvgIcon icon={iconWarning} />
                    </span>
                )}
            </div>

            <div className={cx('email-consent')}>
                <div>
                    <input id="box" type="checkbox" hidden />
                    <label htmlFor="box">
                        <SvgIcon icon={iconTickBox} />
                    </label>
                </div>
                <p>
                    Nhận nội dung thịnh hành, bản tin, khuyến mại, đề xuất và thông tin cập nhật tài khoản được gửi đến
                    email của bạn
                </p>
            </div>

            {/* Submit */}
            <Button
                className={cx('submit-btn', { disable: !email || !password || !rePassword })}
                color
                large
                disable={!email || !password}
                onClick={handleSubmit}
            >
                Tiếp
            </Button>
        </form>
    );
}

export default RegisterWithEmail;
