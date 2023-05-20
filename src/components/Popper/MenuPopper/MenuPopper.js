import PropTypes from 'prop-types';
import { useState, memo, useEffect } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import classNames from 'classnames/bind';

import styles from './menuPopper.module.scss';
import { PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import MenuHeader from './MenuHeader';

const cx = classNames.bind(styles);

function MenuPopper({ children, items = [], handleClickMenu, customsTippy = {} }) {
    const [menuList, setMenuList] = useState([{ data: items }]);

    useEffect(() => {
        if (items.length === 0) return;

        setMenuList([{ data: items }]);
    }, [items]);

    const getLastItem = (items) => {
        const lastIndex = items.length - 1;
        return items[lastIndex];
    };

    // Handle when click item had sub menu
    const handleGoMenuChildren = (childrenItem) => {
        return setMenuList([...menuList, childrenItem]);
    };

    const handleBackMenuChildren = () => {
        const newMenuItems = [...menuList];
        newMenuItems.pop();
        return setMenuList(newMenuItems);
    };

    const renderMenu = (attrs) => (
        <nav className={cx('menu-wrapper')} tabIndex="-1" {...attrs}>
            <div className={cx('arrow-popper')} data-popper-arrow />
            <PopperWrapper
                className={cx('menu-list', {
                    'sub-menu-list': menuList.length > 1,
                })}
            >
                {menuList.length > 1 && <MenuHeader title={menuTitle} onBack={handleBackMenuChildren} />}
                <div className={cx('menu-item-wrapper')}>{renderMenuItems()}</div>
            </PopperWrapper>
        </nav>
    );

    // Render menu item
    const renderMenuItems = () => {
        const bodyClassList = document.body.classList;
        if (currentMenu.data.length >= 15) {
            bodyClassList.add('hidden');
        } else {
            const isModalActive = bodyClassList.contains('modal');
            isModalActive || bodyClassList.remove('hidden');
        }

        return currentMenu.data.map((menuItem, index) => {
            const haveChildren = !!menuItem.children;

            const handleClick = () => {
                haveChildren ? handleGoMenuChildren(menuItem.children) : handleClickMenu(menuItem);
            };

            return <MenuItem key={index} menuInfo={menuItem} onClick={handleClick} isSubMenu={menuList.length > 1} />;
        });
    };

    // Get data of last element in items array
    const currentMenu = getLastItem(menuList);
    const menuTitle = currentMenu.title;

    return (
        <TippyHeadless
            // visible
            render={renderMenu}
            interactive
            placement="bottom-end"
            offset={[20, 12]}
            delay={[0, 700]}
            hideOnClick={false}
            onHidden={() => {
                setMenuList([menuList[0]]);
            }}
            {...customsTippy}
        >
            {children}
        </TippyHeadless>
    );
}

MenuPopper.propTypes = {
    children: PropTypes.element,
    items: PropTypes.array,
    defaultClickMenu: PropTypes.func,
    customsTippy: PropTypes.object,
};

export default memo(MenuPopper);
