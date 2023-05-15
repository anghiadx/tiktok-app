import { useState, useEffect, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './UpdateProfileModal.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { updateCurrentUser } from '~/redux/slices/authSlice';
import ModalWrapper from '../ModalWrapper';
import SvgIcon from '~/components/SvgIcon/SvgIcon';
import { iconCloseX, iconEdit } from '~/components/SvgIcon/iconsRepo';
import Img from '~/components/Img';
import Button from '~/components/Button/Button';
import { NotifyContextKey } from '~/contexts/NotifyContext';
import { authService } from '~/services';

const cx = classNames.bind(styles);

const maxBio = 80;

function UpdateProfileModal({ handleClose }) {
    // Redux
    const { currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // State
    const [isClose, setIsClose] = useState(false);
    const [avatar, setAvatar] = useState({ url: currentUser.avatar });
    const [firstName, setFirstName] = useState(currentUser.first_name);
    const [lastName, setLastName] = useState(currentUser.last_name);
    const [website, setWebsite] = useState(currentUser.website_url);
    const [websiteError, setWebsiteError] = useState('');
    const [bio, setBio] = useState(currentUser.bio);

    const [loading, setLoading] = useState(false);

    const errorList = useRef(['', '']);

    // Context
    const showNotify = useContext(NotifyContextKey);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(avatar.url);
        };
    }, [avatar]);

    const checkStringLength = (string, length, errorIndex) => {
        if (string.length <= length) {
            errorList.current[errorIndex] = '';
        } else {
            errorList.current[errorIndex] = `Tối đa ${length} ký tự`;
        }
    };

    const handleFirstName = (e) => {
        const val = e.target.value;
        if (!val.startsWith(' ')) {
            checkStringLength(val, 15, 0);
            setFirstName(val);
        }
    };

    const handleLastName = (e) => {
        const val = e.target.value;
        if (!val.startsWith(' ')) {
            checkStringLength(val, 15, 1);
            setLastName(val);
        }
    };

    const handleWebsite = (e) => {
        const val = e.target.value;
        if (val.startsWith(' ')) {
            return;
        }

        setWebsite(val);
    };

    const handleBlurWebsite = () => {
        if (!website) {
            return;
        }
        const regexUrl =
            /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:www\.)?(?:[a-zA-Z0-9-]+\.)+(?:[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/[^\s]*)?$/i;

        !regexUrl.test(website) && setWebsiteError('Địa chỉ website không hợp lệ!');
    };

    const handleFocusWebsite = () => {
        websiteError && setWebsiteError('');
    };

    const handleChangeBio = (e) => {
        const val = e.target.value;
        if (!val.startsWith(' ')) {
            val.length <= maxBio && setBio(val);
        }
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        // Append avatar
        avatar.type && formData.append('avatar', avatar);

        const dataString = {
            first_name: firstName,
            last_name: lastName,
            website_url: website,
            bio,
        };

        Object.keys(dataString).forEach((key) => {
            dataString[key] && formData.append(key, dataString[key]);
        });

        setLoading(true);
        const dataResponse = await authService.updateCurrentUser(formData);
        setLoading(false);

        // Update success
        if (dataResponse) {
            dispatch(updateCurrentUser(dataResponse));
            setIsClose(true);
            showNotify('Cập nhật thông tin thành công!', 3000);
        } else {
            showNotify('Cập nhật thất bại, vui lòng thử lại!', 3000);
        }
    };

    const disableSubmit = !firstName || !lastName || !!websiteError || errorList.current.some((error) => !!error);

    return (
        <ModalWrapper className={cx('wrapper')} isClose={isClose} onClose={handleClose} animateEnd="hidden-effect-fade">
            <header>
                <h2>Sửa hồ sơ</h2>
                <button
                    className={cx('close-btn')}
                    onClick={() => {
                        setIsClose(true);
                    }}
                >
                    <SvgIcon size={24} icon={iconCloseX} />
                </button>
            </header>

            <section>
                <div className={cx('group')}>
                    <p className={cx('title')}>Ảnh hồ sơ</p>
                    <div className={cx('content', 'avatar-container')}>
                        <label htmlFor="avatar">
                            <Img src={avatar.url} alt="" className={cx('avatar')} />
                            <SvgIcon icon={iconEdit} className={cx('avatar-edit')} />
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            hidden
                            onChange={(e) => {
                                const [file] = e.target.files;

                                if (!file) {
                                    return;
                                }

                                const types = ['image/jpeg', 'image/jpg', 'image/png'];
                                if (types.includes(file.type)) {
                                    file.url = URL.createObjectURL(file);
                                    setAvatar(file);
                                } else {
                                    showNotify('Định dạng file không hợp lệ!', 3000);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* First name */}
                <div className={cx('group')}>
                    <p className={cx('title')}>Họ</p>
                    <div className={cx('content')}>
                        <input
                            type="text"
                            className={cx('input-box', {
                                error: !!errorList.current[0],
                            })}
                            placeholder="Họ"
                            value={firstName}
                            spellCheck={false}
                            onChange={handleFirstName}
                        />
                        {errorList.current[0] && <p className={cx('description', 'error')}>{errorList.current[0]}</p>}
                        <p className={cx('description')}>Nhập họ của bạn</p>
                    </div>
                </div>

                {/* Last name */}
                <div className={cx('group')}>
                    <p className={cx('title')}>Tên</p>
                    <div className={cx('content')}>
                        <input
                            type="text"
                            className={cx('input-box', {
                                error: !!errorList.current[1],
                            })}
                            placeholder="Tên"
                            value={lastName}
                            spellCheck={false}
                            onChange={handleLastName}
                        />
                        {errorList.current[1] && <p className={cx('description', 'error')}>{errorList.current[1]}</p>}
                        <p className={cx('description')}>Nhập tên của bạn</p>
                    </div>
                </div>

                {/* Website */}
                <div className={cx('group')}>
                    <p className={cx('title')}>Website</p>
                    <div className={cx('content')}>
                        <input
                            type="text"
                            className={cx('input-box', {
                                error: websiteError,
                            })}
                            placeholder="Địa chỉ website"
                            value={website}
                            spellCheck={false}
                            onChange={handleWebsite}
                            onBlur={handleBlurWebsite}
                            onFocus={handleFocusWebsite}
                        />
                        {websiteError && <p className={cx('description', 'error')}>{websiteError}</p>}
                        <p className={cx('description')}>Nhập địa chỉ web của bạn</p>
                    </div>
                </div>

                {/* Bio */}
                <div className={cx('group')} style={{ border: 'none' }}>
                    <p className={cx('title')}>Tiểu sử</p>
                    <div className={cx('content')}>
                        <textarea
                            rows="3"
                            className={cx('textarea-box', 'input-box')}
                            placeholder="Tiểu sử"
                            value={bio}
                            spellCheck={false}
                            onChange={handleChangeBio}
                            onKeyDown={(e) => {
                                e.keyCode === 13 && e.preventDefault();
                            }}
                        ></textarea>
                        <p className={cx('description')} style={{ marginBottom: -8 }}>
                            {bio.length}/80
                        </p>
                    </div>
                </div>
            </section>

            <footer>
                <Button
                    primary
                    onClick={() => {
                        setIsClose(true);
                    }}
                >
                    Hủy
                </Button>
                <Button
                    className={cx({
                        'disable-btn': disableSubmit,
                    })}
                    color
                    disable={disableSubmit || loading}
                    onClick={handleUpdate}
                >
                    {!loading ? 'Lưu' : <FontAwesomeIcon className={cx('loading-icon')} icon={faCircleNotch} />}
                </Button>
            </footer>
        </ModalWrapper>
    );
}

export default UpdateProfileModal;
