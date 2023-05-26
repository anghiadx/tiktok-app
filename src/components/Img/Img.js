import PropTypes from 'prop-types';
import { forwardRef, useLayoutEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Img.module.scss';
import assetImages from '~/assets/images';

const cx = classNames.bind(styles);

const Img = forwardRef(function ({ className, src, alt = '', fallback = assetImages.noImage, ...props }, REF) {
    const [error, setError] = useState(null);

    useLayoutEffect(() => {
        setError(null);
    }, [src]);

    const handleImageError = () => {
        setError(fallback);
    };
    return (
        <img
            className={cx('img', { [className]: className })}
            ref={REF}
            src={error || src}
            alt={alt}
            {...props}
            onError={handleImageError}
        />
    );
});

Img.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    fallback: PropTypes.string,
};

export default Img;
