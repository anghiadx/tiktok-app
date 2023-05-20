import PropTypes from 'prop-types';
import { useState } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './SharePopper.module.scss';
import { PopperWrapper } from '~/components/Popper';
import Button from '~/components/Button';
import SvgIcon from '~/components/SvgIcon';
import { iconArrowToBot } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function SharePopper({ children, data, customTippy = {}, arrowTop = false }) {
    const [showFullList, setShowFullList] = useState(false);

    const currentList = showFullList ? data : data.slice(0, 5);

    const handleShowFull = () => {
        return setShowFullList(true);
    };

    const handleShowLess = () => {
        return setShowFullList(false);
    };

    const handleRenderItem = (attrs) => (
        <div className={cx('share-wrapper')} tabIndex="-1" {...attrs} onClick={(e) => e.stopPropagation()}>
            <PopperWrapper className={cx('share-popper', { seeFull: showFullList })}>
                <div className={cx('arrow-popper', { arrowTop: arrowTop })} data-popper-arrow />
                <div className={cx('share-list')}>
                    {currentList.map((share, index) => (
                        <Button
                            key={index}
                            large
                            className={cx('share-item')}
                            iconClassName={cx('share-item-icon')}
                            leftIcon={<SvgIcon icon={share.icon} />}
                            href={share.href}
                            target={share.href && '_blank'}
                        >
                            {share.title}
                        </Button>
                    ))}
                    {data.length > 5 && !showFullList && (
                        <div className={cx('see-more-btn')} onClick={handleShowFull}>
                            <SvgIcon icon={iconArrowToBot} size={24} />
                        </div>
                    )}
                </div>
            </PopperWrapper>
        </div>
    );

    return (
        <TippyHeadless
            interactive
            placement="top-start"
            offset={[-24, 4]}
            delay={[0, 400]}
            popperOptions={{ modifiers: [{ name: 'flip', enabled: false }] }}
            onHidden={handleShowLess}
            render={handleRenderItem}
            {...customTippy}
        >
            {children}
        </TippyHeadless>
    );
}

SharePopper.propTypes = {
    children: PropTypes.node.isRequired,
    data: PropTypes.array,
    customTippy: PropTypes.object,
    arrowTop: PropTypes.bool,
};

export default SharePopper;
