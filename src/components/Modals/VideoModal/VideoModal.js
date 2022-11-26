import { useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Button from '~/components/Button';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import SvgIcon from '~/components/SvgIcon';
import {
    iconComment,
    iconEmbed,
    iconFacebookShare,
    iconHeart,
    iconMusic,
    iconPlaneShare,
    iconShareMini,
    iconTwitter,
    iconWhatsApp,
} from '~/components/SvgIcon/iconsRepo';
import styles from './VideoModal.module.scss';
import SharePopper from '~/components/Shares/SharePopper';
import dataTemp from '~/temp/data';
import CommentShow from './CommentShow/';
import AccountPreview from '~/components/Items/AccountItem/AccountPreview';
import VideoPlayer from './VideoPlayer';
import { ModalContextKey } from '~/contexts/ModalContext';

const cx = classNames.bind(styles);

function VideoModal(props) {
    const { data = {}, handleClose } = props;
    const {
        id: videoId,
        created_at: createdAt,
        description,
        music: musicInfo,
        likes_count: likesCount,
        comments_count: commentsCount,
        user: {
            avatar: avatarUrl,
            nickname: userName,
            first_name: firstName,
            last_name: lastName,
            tick,
            bio,

            followers_count: followersCount,
            likes_count: userLikesCount,
        },
    } = data;

    const { loginModalShow } = useContext(ModalContextKey);

    const currentUser = false;

    useEffect(() => {
        window.history.replaceState(null, '', `/#/video/${videoId}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('video-container')}>
                <VideoPlayer {...props} />
            </div>

            {/* CONTENT */}
            <div className={cx('content-container')}>
                <header className={cx('video-info')}>
                    <div className={cx('info__account')}>
                        <Link to={'/@' + userName}>
                            <AccountPreview
                                avatarUrl={avatarUrl}
                                userName={userName}
                                fullName={`${firstName} ${lastName}`}
                                tick={tick}
                                followerCount={followersCount}
                                likeCount={userLikesCount}
                                bio={bio}
                                customTippy={{ zIndex: 1000001, offset: [0, 4] }}
                                onCloseModal={handleClose}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }} onClick={handleClose}>
                                    <Img className={cx('avatar')} src={avatarUrl} />

                                    <div className={cx('body')}>
                                        <p className={cx('username')}>
                                            {userName} <ShowTick tick={tick} />
                                        </p>
                                        <p className={cx('fullname')}>
                                            {firstName} {lastName} · {createdAt?.slice(0, 10)}
                                        </p>
                                    </div>
                                </div>
                            </AccountPreview>
                        </Link>
                        <Button
                            className={cx('follow-btn')}
                            outline
                            medium
                            onClick={!currentUser ? loginModalShow : null}
                        >
                            Follow
                        </Button>
                    </div>

                    <p className={cx('description')}>{description}</p>
                    <p className={cx('music')}>
                        <SvgIcon style={{ marginRight: 8 }} icon={iconMusic} />
                        {musicInfo || `Nhạc nền - ${firstName} ${lastName}`}
                    </p>

                    <div className={cx('info__interactive')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* Count */}
                            <div className={cx('counts-list')}>
                                <p
                                    className={cx('count-item')}
                                    style={{ cursor: 'pointer' }}
                                    onClick={!currentUser ? loginModalShow : null}
                                >
                                    <span className={cx('count-icon')}>
                                        <SvgIcon icon={iconHeart} />
                                    </span>
                                    <strong className={cx('count-title')}>{likesCount}</strong>
                                </p>

                                <p className={cx('count-item')}>
                                    <span className={cx('count-icon')}>
                                        <SvgIcon icon={iconComment} />
                                    </span>
                                    <strong className={cx('count-title')}>{commentsCount}</strong>
                                </p>
                            </div>

                            {/* Share */}
                            <div className={cx('shares-list')}>
                                <Tippy content="Nhúng" zIndex={1000001} offset={[0, 8]}>
                                    <span className={cx('share-item')}>
                                        <SvgIcon icon={iconEmbed} />
                                    </span>
                                </Tippy>
                                <Tippy content="Chia sẻ đến bạn bè" zIndex={1000001} offset={[0, 8]}>
                                    <span className={cx('share-item')}>
                                        <SvgIcon icon={iconPlaneShare} />
                                    </span>
                                </Tippy>
                                <Tippy content="Chia sẻ với Facebook" zIndex={1000001} offset={[0, 8]}>
                                    <a
                                        href="https://facebook.com/"
                                        className={cx('share-item')}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <SvgIcon icon={iconFacebookShare} />
                                    </a>
                                </Tippy>
                                <Tippy content="Chia sẻ với WhatsApp" zIndex={1000001} offset={[0, 8]}>
                                    <a
                                        href="https://wa.me"
                                        className={cx('share-item')}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <SvgIcon icon={iconWhatsApp} />
                                    </a>
                                </Tippy>
                                <Tippy content="Chia sẻ với Twitter" zIndex={1000001} offset={[0, 8]}>
                                    <a
                                        href="https://twitter.com"
                                        className={cx('share-item')}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <SvgIcon icon={iconTwitter} />
                                    </a>
                                </Tippy>
                                <SharePopper
                                    data={dataTemp.shares.videoModalShare}
                                    arrowTop
                                    customTippy={{ placement: 'bottom-end', offset: [12, 12], hideOnClick: false }}
                                >
                                    <span
                                        className={cx('share-item', 'share-more')}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <SvgIcon icon={iconShareMini} size={16} />
                                    </span>
                                </SharePopper>
                            </div>
                        </div>

                        {/* Copy Link */}

                        <div className={cx('copy-link')}>
                            <p className={cx('link')}>Https://tiktok.nghiane.cf/</p>
                            <button className={cx('copy-btn')}>Sao chép liên kết</button>
                        </div>
                    </div>
                </header>

                {/* COMMENT */}
                <section className={cx('comment-container')}>
                    <CommentShow videoId={videoId} onCloseModal={handleClose} />
                </section>

                <footer className={cx('create-comment')}>
                    <div className={cx('no-login')}>
                        <p className={cx('notify-btn')} onClick={!currentUser ? loginModalShow : null}>
                            Please log in to comment
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default VideoModal;
