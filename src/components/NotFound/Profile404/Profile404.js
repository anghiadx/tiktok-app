import classNames from 'classnames/bind';

import styles from './Profile404.module.scss';
import PropTypes from 'prop-types';
import SvgIcon from '~/components/SvgIcon';
import { iconBigUser } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function Profile404({ title, content, icon = iconBigUser }) {
    return (
        <div className={cx('profile-404')}>
            <div style={{ textAlign: 'center' }}>
                <SvgIcon className={cx('profile-404__icon')} icon={icon} size={90} />
                <h2 className={cx('profile-404__title')}>{title}</h2>
                <p className={cx('profile-404__content')}>{content}</p>
            </div>
        </div>
    );
}

Profile404.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    icon: PropTypes.node,
};

export default Profile404;
