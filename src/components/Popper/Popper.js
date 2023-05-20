import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import PopperWrapper from './Wrapper';
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

function Popper({ className, children, render, enableArrow = false, customTippy, popperStyle }) {
    let defaultTippy = {};

    switch (popperStyle) {
        case 'see-more':
            defaultTippy = {
                zIndex: 999999,
                placement: 'bottom-end',
                interactive: true,
                delay: [0, 150],
                offset: [4, 8],
                popperOptions: { modifiers: [{ name: 'flip', enabled: false }] },
                hideOnClick: false,
            };
            break;
        default:
            break;
    }

    return (
        <TippyHeadless
            render={(attrs) => (
                <div tabIndex="-1" {...attrs}>
                    <PopperWrapper className={className}>
                        {enableArrow && <div className={cx('arrow-popper')} data-popper-arrow />}
                        {render}
                    </PopperWrapper>
                </div>
            )}
            interactive
            {...defaultTippy}
            {...customTippy}
        >
            {children}
        </TippyHeadless>
    );
}

export default Popper;
