import classNames from 'classnames/bind';

import styles from './NotFoundNotify.module.scss';
import PropTypes from 'prop-types';
import SvgIcon from '~/components/SvgIcon';
import { iconBigUser } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function NotFoundNotify({ title, content, icon = <SvgIcon style={{ opacity: 0.34 }} icon={iconBigUser} size={90} /> }) {
    return (
        <div className={cx('notify')}>
            <div style={{ textAlign: 'center' }}>
                {icon}
                <h2 className={cx('notify__title')}>{title}</h2>
                <p className={cx('notify__content')}>{content}</p>
            </div>
        </div>
    );
}

NotFoundNotify.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    icon: PropTypes.node,
};

export default NotFoundNotify;
