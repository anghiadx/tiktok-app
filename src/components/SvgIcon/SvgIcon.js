import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const SvgIcon = forwardRef(({ icon, size, style = {}, className, onClick }, ref) => {
    return (
        <i ref={ref} className={className} style={{ lineHeight: 0, fontSize: size, ...style }} onClick={onClick}>
            {icon}
        </i>
    );
});

SvgIcon.propTypes = {
    icon: PropTypes.element,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default SvgIcon;
