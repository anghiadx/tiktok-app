import { memo, useRef, useContext, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import TippyHeadless from '@tippyjs/react/headless';
import { useSelector } from 'react-redux';
import LottieIcon from '~/components/LottieIcon';

import { tiktokCommentLikeAnimate } from '~/assets/lotties';
import { PopperWrapper } from '~/components/Popper';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import SvgIcon from '~/components/SvgIcon';
import { iconFlag, iconHeartRegular, iconRecycleBin } from '~/components/SvgIcon/iconsRepo';
import styles from './CommentShow.module.scss';
import AccountPreview from '~/components/Items/AccountItem/AccountPreview';
import { iconSeeMoreHorizontal } from '~/components/SvgIcon/iconsRepo';
import { ModalContextKey } from '~/contexts/ModalContext';
import { NotifyContextKey } from '~/contexts/NotifyContext';
import Button from '~/components/Button';
import { commentService } from '~/services';
import { likeService } from '~/services';

const cx = classNames.bind(styles);

function CommentShow({ index, data, authorId, onCloseModal, setComments }) {
    // Context
    const { confirmModalShow } = useContext(ModalContextKey);
    const showNotify = useContext(NotifyContextKey);

    // Redux
    const { currentUser } = useSelector((state) => state.auth);

    // Destructuring data
    const {
        id: commentId,
        comment,
        is_liked,
        likes_count: likesCount,
        created_at,
        user: { first_name: firstName, last_name: lastName, nickname: userName, avatar: avatarUrl, tick, id: userId },
    } = data;

    const createdAt = created_at.slice(0, 10);

    // State
    const [isLiked, setIsLiked] = useState(is_liked);

    // Ref
    const wrapperRef = useRef();
    const heartIconRef = useRef();

    useEffect(() => {
        isLiked && heartIconRef.current.goToAndStop(35, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset state if data is changed
    useEffect(() => {
        setIsLiked(data.is_liked);
    }, [data]);

    const AccPreview = ({ children, customs = {} }) => {
        return (
            <AccountPreview
                outline
                userInfo={data.user}
                customTippy={{
                    zIndex: 9,
                    offset: [-50, 20],
                    popperOptions: { modifiers: [{ name: 'flip', enabled: true }] },
                    appendTo: undefined,
                    ...customs,
                }}
                onCloseModal={onCloseModal}
            >
                {children}
            </AccountPreview>
        );
    };

    const handleToggleLike = () => {
        if (isLiked) {
            likeService.unlikeComment(commentId);
            data.likes_count--;
            data.is_liked = false;
        } else {
            likeService.likeComment(commentId);
            data.likes_count++;
            data.is_liked = true;
        }

        setIsLiked(!isLiked);
    };

    const handleDeleteComment = async () => {
        const dataResponse = await commentService.dele(commentId);

        if (dataResponse.message) {
            showNotify('Xóa thất bại. Vui lòng thử lại!');
        } else {
            showNotify('Đã xóa!', 2000);

            setComments((prevComments) => {
                const newComments = [...prevComments];
                newComments.splice(index, 1);

                return newComments;
            });
        }
    };

    const confirmDeleteComment = () => {
        // Create data modal
        const dataConfirmModal = {
            content: <p className={cx('confirm-modal-content')}>Bạn có chắc chắn muốn xóa bình luận này?</p>,
            apply: (
                <p className={cx('confirm-modal-apply')} onClick={handleDeleteComment}>
                    Xóa
                </p>
            ),
            cancel: <p className={cx('confirm-modal-cancel')}>Hủy</p>,
        };

        // Show confirm modal
        confirmModalShow(dataConfirmModal);
    };

    return (
        <div className={cx('comment-item')} ref={wrapperRef}>
            {/* Avatar */}
            <Link to={'/@' + userName} className={cx('avatar-wrapper')} onClick={onCloseModal}>
                <AccPreview customs={{ offset: [2, 4] }}>
                    <Img className={cx('avatar')} src={avatarUrl} />
                </AccPreview>
            </Link>

            {/* Body */}
            <div className={cx('body')}>
                <AccPreview>
                    <Link to={'/@' + userName} className={cx('fullname')} onClick={onCloseModal}>
                        <strong>{`${firstName} ${lastName}`}</strong> <ShowTick tick={tick} />
                        {/* Show author or not */}
                        {userId === authorId && <span className={cx('author')}>Tác giả</span>}
                    </Link>
                </AccPreview>
                <p className={cx('content')}>{comment}</p>
                <p className={cx('other')}>
                    <span>{createdAt}</span>
                    <span className={cx('reply')}>Trả lời</span>
                </p>
            </div>

            {/* Interactive */}
            <div className={cx('like-comment')}>
                <span className={cx('like-icon')} onClick={handleToggleLike}>
                    {isLiked ? (
                        <LottieIcon
                            ref={heartIconRef}
                            className={cx('heart-icon')}
                            icon={tiktokCommentLikeAnimate}
                            options={{ loop: false }}
                        />
                    ) : (
                        <SvgIcon icon={iconHeartRegular} size={20} />
                    )}
                </span>
                <span className={cx('like-count')}>{likesCount}</span>
            </div>

            {/* See more */}
            <TippyHeadless
                render={(attrs) => (
                    <section tabIndex="-1" {...attrs}>
                        <div className={cx('arrow-popper')} data-popper-arrow />
                        <PopperWrapper className={cx('more-popper')}>
                            {/* Người đăng comment khác bản thân -> hiện báo cáo */}
                            {currentUser.id !== userId && (
                                <Button className={cx('more-item')} leftIcon={<SvgIcon icon={iconFlag} size={24} />}>
                                    Báo cáo
                                </Button>
                            )}
                            {/* Bản thân là chủ video hoặc người đăng comment  -> Hiện xóa */}
                            {(currentUser.id === authorId || currentUser.id === userId) && (
                                <Button
                                    className={cx('more-item')}
                                    leftIcon={<SvgIcon icon={iconRecycleBin} size={24} />}
                                    onClick={confirmDeleteComment}
                                >
                                    Xóa
                                </Button>
                            )}
                        </PopperWrapper>
                    </section>
                )}
                zIndex={999999}
                placement="bottom-end"
                interactive
                delay={[0, 150]}
                offset={[4, 8]}
                popperOptions={{ modifiers: [{ name: 'flip', enabled: false }] }}
                hideOnClick={false}
            >
                <button className={cx('more-icon')}>
                    <SvgIcon icon={iconSeeMoreHorizontal} size={21} />
                </button>
            </TippyHeadless>
        </div>
    );
}
export default memo(CommentShow);
