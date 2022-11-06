import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ModalWrapper.module.scss';
import PopperWrapper from '~/components/Popper';

const cx = classNames.bind(styles);

function ModalWrapper({ children, className }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('overlay')}></div>
            <PopperWrapper className={cx('content', className)}>{children}</PopperWrapper>
        </div>
    );
}

ModalWrapper.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default ModalWrapper;
