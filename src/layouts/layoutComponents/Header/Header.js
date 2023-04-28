import { memo, useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '~/redux/slices/authSlice';
import styles from './header.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconLogo, iconMessage, iconPlane, iconPlus, iconSeeMore } from '~/components/SvgIcon/iconsRepo';
import Button from '~/components/Button';
import { MenuPopper } from '~/components/Popper';
import Img from '~/components/Img';
import Search from './Search';
import configs from '~/configs';
import dataTemp from '~/temp/data';
import { ModalContextKey } from '~/contexts/ModalContext';
import { NotifyContextKey } from '~/contexts/NotifyContext';

const cx = classNames.bind(styles);

function Header() {
    // context
    const { loginModalShow, keyboardModalShow } = useContext(ModalContextKey);
    const showNotify = useContext(NotifyContextKey);

    // redux
    const dispatch = useDispatch();
    const { isAuth, currentUser } = useSelector((state) => state.auth);

    const menuInfo = isAuth ? dataTemp.menus.PRIVATE_MENU : dataTemp.menus.PUBLIC_MENU;

    // Routing
    const navigate = useNavigate();

    // Handle Menu
    const handleDefaultClickMenu = (itemInfo) => {
        switch (itemInfo.type) {
            case 'keyboard-modal':
                keyboardModalShow();
                break;

            case 'view-profile':
                const urlPath = window.location.hash;
                const profilePath = '/@' + currentUser.nickname;

                if (urlPath !== '#' + profilePath) {
                    navigate(profilePath);
                }
                break;
            case 'user-logout':
                dispatch(logout()).then(() => {
                    showNotify('Tài khoản đã đăng xuất!');
                });

                break;
            default:
                // console.log(itemInfo);
                break;
        }
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner-header')}>
                {/* Logo container */}
                <div className={cx('logo')}>
                    <Link to={configs.routes.home}>
                        <SvgIcon icon={iconLogo} />
                    </Link>
                </div>

                {/* Search Container */}
                <Search />

                {/* Action Container */}
                <div className={cx('action-container')}>
                    <Button
                        to={isAuth ? configs.routes.upload : null}
                        primary
                        leftIcon={<SvgIcon icon={iconPlus} size={20} />}
                        onClick={!isAuth ? loginModalShow : null}
                    >
                        Tải lên
                    </Button>

                    {isAuth ? (
                        <>
                            <Tippy content="Tin nhắn">
                                <button className={cx('user-action-icon', 'plane-icon')}>
                                    <SvgIcon icon={iconPlane} size={26} />
                                </button>
                            </Tippy>
                            <Tippy content="Hộp thư">
                                <button className={cx('user-action-icon')}>
                                    <SvgIcon icon={iconMessage} size={32} />
                                    <span className={cx('notify')}>10</span>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button color onClick={loginModalShow}>
                                Đăng nhập
                            </Button>
                        </>
                    )}

                    <MenuPopper items={menuInfo} handleClickMenu={handleDefaultClickMenu}>
                        {isAuth ? (
                            <Img src={currentUser.avatar} alt="" className={cx('user-avatar')} />
                        ) : (
                            <button className={cx('see-more-btn', 'lh0')}>
                                <SvgIcon icon={iconSeeMore} />
                            </button>
                        )}
                    </MenuPopper>
                </div>
            </div>
        </header>
    );
}

export default memo(Header);
