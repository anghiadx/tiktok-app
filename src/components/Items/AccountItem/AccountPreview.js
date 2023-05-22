import PropTypes from 'prop-types';
import TippyHeadless from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './AccountItem.module.scss';
import { PopperWrapper } from '~/components/Popper';
import Button from '~/components/Button';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import HandleFollow from '~/components/UserInteractive/HandleFollow';

const cx = classNames.bind(styles);

function AccountPreview({ userInfo, children, className, customTippy, onCloseModal, outline = false }) {
    // Redux
    const { currentUser } = useSelector((state) => state.auth);

    const renderPreview = (attrs) => (
        <div
            className={cx({
                [className]: className,
            })}
            tabIndex="-1"
            onClick={(e) => e.preventDefault()}
            {...attrs}
        >
            <PopperWrapper className={cx('preview-account')}>
                {/* Header */}
                <div className={cx('preview-header')}>
                    <Link to={`/@${userInfo?.nickname}`} onClick={onCloseModal}>
                        <Img
                            className={cx('avatar')}
                            src={userInfo?.avatar}
                            alt={`${userInfo?.first_name} ${userInfo?.last_name}`}
                        />
                    </Link>

                    {userInfo?.id !== currentUser.id && (
                        <HandleFollow
                            followElement={
                                <Button color={!outline} outline={outline} medium={outline}>
                                    Follow
                                </Button>
                            }
                            followedElement={
                                <Button primary xmedium>
                                    Đang Follow
                                </Button>
                            }
                            defaultFollowed={userInfo?.is_followed}
                            userId={userInfo?.id}
                        />
                    )}
                </div>

                {/* Body */}
                <Link to={`/@${userInfo?.nickname}`} className={cx('preview-body')} onClick={onCloseModal}>
                    <span className={cx('username')}>{userInfo?.nickname}</span>
                    {<ShowTick tick={userInfo?.tick} />}
                    <br />
                    <span className={cx('name')}>{`${userInfo?.first_name} ${userInfo?.last_name}`}</span>
                </Link>

                {/* Footer */}
                <footer className={cx('preview-footer')}>
                    <b className={cx('user-status')}>{userInfo?.followers_count}</b>
                    <span className={cx('user-status-title')}>Follower</span>
                    <b className={cx('user-status')}>{userInfo?.likes_count}</b>
                    <span className={cx('user-status-title')}>Thích</span>

                    {userInfo?.bio && <div className={cx('bio')}>{userInfo?.bio}</div>}
                </footer>
            </PopperWrapper>
        </div>
    );

    return (
        // Interactive tippy element may not be accessible via keyboard navigation because it is not directly
        // after the reference element in the DOM source order.

        // Using a wrapper <span> tag around the reference element solves this by creating
        // a new parentNode context.

        <span>
            <TippyHeadless
                placement="bottom-start"
                interactive
                delay={[1000, 0]}
                appendTo={document.body}
                popperOptions={{ modifiers: [{ name: 'flip', enabled: false }] }}
                {...customTippy}
                render={renderPreview}
            >
                {children}
            </TippyHeadless>
        </span>
    );
}

AccountPreview.propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    userInfo: PropTypes.object,
    customTippy: PropTypes.object,
    onCloseModal: PropTypes.func,
};

export default AccountPreview;
