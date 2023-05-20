import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSelector } from 'react-redux';
import Button from '~/components/Button';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import SvgIcon from '~/components/SvgIcon';
import {
    iconEmbed,
    iconFacebookShare,
    iconMusic,
    iconPlaneShare,
    iconRecycleBin,
    iconSeeMoreHorizontal,
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
import { NotifyContextKey } from '~/contexts/NotifyContext';
import HashtagFilter from '~/components/Filters/HashtagFilter';
import VideoInteractive from './VideoInteractive';
import CommentCreator from './CommentCreator';
import HandleFollow from '~/components/UserInteractive/HandleFollow';
import Popper from '~/components/Popper';
import { videoService } from '~/services';

const cx = classNames.bind(styles);

function VideoModal(props) {
    const { data = {}, handleClose } = props;
    const {
        id: videoId,
        created_at: createdAt,
        description,
        music: musicInfo,
        user: {
            id: userId,
            is_followed,
            avatar: avatarUrl,
            nickname: userName,
            first_name: firstName,
            last_name: lastName,
            tick,
        },
    } = data;

    // Context
    const { loginModalShow, confirmModalShow } = useContext(ModalContextKey);
    const showNotify = useContext(NotifyContextKey);

    // Redux
    const { isAuth, currentUser } = useSelector((state) => state.auth);

    // State
    const [comments, setComments] = useState([]);

    useEffect(() => {
        window.history.replaceState(null, '', `/#/video/${videoId}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const confirmDeleteVideo = () => {
        // Create data modal
        const dataConfirmModal = {
            content: (
                <div className={cx('confirm-modal-content')}>
                    <h2>Bạn có chắc chắn muốn xóa video này?</h2>
                    <p>
                        Dữ liệu tạm thời của video có thể vẫn còn tồn tại, tuy nhiên các tương tác người dùng sẽ không
                        thể thực thi trên video đã xóa. Làm mới trang để cập nhật dữ diệu mới nhất.
                    </p>
                </div>
            ),
            apply: (
                <p className={cx('confirm-modal-apply')} onClick={handleDeleteVideo}>
                    Xóa
                </p>
            ),
            cancel: <p className={cx('confirm-modal-cancel')}>Hủy</p>,
        };

        // Show confirm modal
        confirmModalShow(dataConfirmModal);
    };

    const handleDeleteVideo = async () => {
        const responseData = await videoService.deleteVideo(videoId);

        responseData?.message ? showNotify('Không thể xóa video. Vui lòng thử lại sau!') : showNotify('Đã xóa video');
    };

    return (
        <div className={cx('wrapper')}>
            {/* VIDEO PLAYER */}
            <div className={cx('video-container')}>
                <VideoPlayer {...props} />
            </div>

            {/* CONTENT */}
            <div className={cx('content-container')}>
                <header className={cx('video-info')}>
                    <div className={cx('info__account')}>
                        <Link to={'/@' + userName}>
                            <AccountPreview
                                outline
                                userInfo={data.user}
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

                        {/* Nếu chính mình là người đăng video -> hiện see more / Ngược lại hiện trạng thái follow */}
                        {userId === currentUser.id ? (
                            <Popper
                                className={cx('more-popper')}
                                popperStyle="see-more"
                                enableArrow
                                render={
                                    <>
                                        <Button
                                            className={cx('more-item')}
                                            leftIcon={<SvgIcon icon={iconRecycleBin} size={22} />}
                                            onClick={confirmDeleteVideo}
                                        >
                                            Xóa video
                                        </Button>
                                    </>
                                }
                            >
                                <button className={cx('see-more-btn')}>
                                    <SvgIcon icon={iconSeeMoreHorizontal} size={24} />
                                </button>
                            </Popper>
                        ) : (
                            <HandleFollow
                                followElement={
                                    <Button className={cx('follow-btn')} outline medium>
                                        Follow
                                    </Button>
                                }
                                followedElement={
                                    <Button className={cx('follow-btn')} primary medium>
                                        Đang Follow
                                    </Button>
                                }
                                defaultFollowed={is_followed}
                                userId={userId}
                            />
                        )}
                    </div>

                    <p className={cx('description')}>
                        <HashtagFilter onCloseModal={handleClose}>{description}</HashtagFilter>
                    </p>
                    <p className={cx('music')}>
                        <SvgIcon style={{ marginRight: 6 }} icon={iconMusic} />
                        {musicInfo || `Nhạc nền - ${firstName} ${lastName}`}
                    </p>

                    <div className={cx('info__interactive')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* Count */}

                            <VideoInteractive isAuth={isAuth} loginModalShow={loginModalShow} videoInfo={data} />

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
                            <p className={cx('link')}>{window.location.href}</p>
                            <button className={cx('copy-btn')}>Sao chép liên kết</button>
                        </div>
                    </div>
                </header>

                {/* COMMENT */}
                <section className={cx('comment-container')}>
                    <CommentShow
                        videoId={videoId}
                        authorId={userId}
                        onCloseModal={handleClose}
                        commentState={[comments, setComments]}
                    />
                </section>

                <footer className={cx('create-comment')}>
                    <div className={cx('comment-create-wrapper')}>
                        {isAuth ? (
                            <CommentCreator setComments={setComments} videoInfo={data} />
                        ) : (
                            <p className={cx('notify-btn')} onClick={!isAuth ? loginModalShow : null}>
                                Please log in to comment
                            </p>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default VideoModal;
