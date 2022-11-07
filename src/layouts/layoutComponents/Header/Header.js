import { memo, useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import styles from './header.module.scss';
import assetImages from '~/assets/images';
import SvgIcon from '~/components/SvgIcon';
import { iconMessage, iconPlane, iconPlus, iconSeeMore } from '~/components/SvgIcon/iconsRepo';
import Button from '~/components/Button';
import { MenuPopper } from '~/components/Popper';
import Img from '~/components/Img';
import Search from './Search';
import configs from '~/configs';
import { ModalContextKey } from '~/contexts/ModalContext';

const cx = classNames.bind(styles);

function Header() {
    const { LoginModalShow, KeyboardModalShow } = useContext(ModalContextKey);

    let currentUser = false;

    const menuInfo = currentUser ? configs.menus.PRIVATE_MENU : configs.menus.PUBLIC_MENU;

    // Handle Menu
    const handleDefaultClickMenu = (itemInfo) => {
        switch (itemInfo.type) {
            case 'keyboard-modal':
                KeyboardModalShow();
                break;
            default:
                console.log(itemInfo);
                break;
        }
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner-header')}>
                {/* Logo container */}
                <div className={cx('logo')}>
                    <Link to={configs.routes.home}>
                        <img src={assetImages.logo} alt="Tiktok" />
                    </Link>
                </div>

                {/* Search Container */}
                <Search />

                {/* Action Container */}
                <div className={cx('action-container')}>
                    <Button
                        to={currentUser ? configs.routes.upload : null}
                        primary
                        leftIcon={<SvgIcon icon={iconPlus} size={20} />}
                        onClick={!currentUser ? LoginModalShow : null}
                    >
                        Tải lên
                    </Button>

                    {currentUser ? (
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
                            <Button color onClick={LoginModalShow}>
                                Đăng nhập
                            </Button>
                        </>
                    )}

                    <MenuPopper items={menuInfo} handleClickMenu={handleDefaultClickMenu}>
                        {currentUser ? (
                            <Img
                                src="https://p16-sign-sg.tiktokcdn.com/aweme/720x720/tiktok-obj/6968378549614936066.jpeg?x-expires=1664776800&x-signature=F0fDoT9MjF4CTqrNRAXksYBPwIE%3D"
                                alt=""
                                className={cx('user-avatar')}
                            />
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
