import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './menuPopper.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({ menuInfo, onClick, isSubMenu }) {
    const { icon, title, rightIcon, href, to, separate } = menuInfo;

    if (href || to) onClick = null;

    const classNames = cx('menu-item', {
        'sub-menu-item': isSubMenu,
        separate,
    });

    return (
        <Button
            className={classNames}
            iconClassName={cx('icon-menu-item')}
            textClassName={cx('text-menu-item')}
            leftIcon={icon}
            rightIcon={rightIcon}
            to={to}
            href={href}
            onClick={onClick}
        >
            {title}
        </Button>
    );
}

MenuItem.propTypes = {
    menuInfo: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    isSubMenu: PropTypes.bool,
};

export default MenuItem;
