import PropTypes from 'prop-types';
import { useContext } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './AccountItem.module.scss';
import PopperWrapper from '~/components/Popper';
import Button from '~/components/Button';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import { ModalContextKey } from '~/contexts/ModalContext';

const cx = classNames.bind(styles);

function AccountPreview({
    children,
    className,
    avatarUrl,
    userName,
    fullName,
    tick,
    followerCount,
    likeCount,
    bio,
    customTippy,
    onCloseModal,
}) {
    const currentUse = false;

    const { loginModalShow } = useContext(ModalContextKey);

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
                    <Link to={`/@${userName}`} onClick={onCloseModal}>
                        <Img className={cx('avatar')} src={avatarUrl} alt={fullName} />
                    </Link>
                    <Button color={!bio} outline={!!bio} medium={!!bio} onClick={!currentUse ? loginModalShow : null}>
                        Follow
                    </Button>
                </div>

                {/* Body */}
                <Link to={`/@${userName}`} className={cx('preview-body')} onClick={onCloseModal}>
                    <span className={cx('username')}>{userName}</span>
                    {<ShowTick tick={tick} />}
                    <br />
                    <span className={cx('name')}>{fullName}</span>
                </Link>

                {/* Footer */}
                <footer className={cx('preview-footer')}>
                    <b className={cx('user-status')}>{followerCount}</b>
                    <span className={cx('user-status-title')}>Follower</span>
                    <b className={cx('user-status')}>{likeCount}</b>
                    <span className={cx('user-status-title')}>Thích</span>

                    {bio && <div className={cx('bio')}>{bio}</div>}
                </footer>
            </PopperWrapper>
        </div>
    );

    return (
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
    );
}

AccountPreview.propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    avatarUrl: PropTypes.string,
    userName: PropTypes.string,
    fullName: PropTypes.string,
    tick: PropTypes.bool,
    bio: PropTypes.string,
    customTippy: PropTypes.object,
    onCloseModal: PropTypes.func,
};

export default AccountPreview;
