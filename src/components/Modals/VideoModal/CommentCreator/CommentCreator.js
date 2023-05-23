import { useRef, useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './CommentCreator.module.scss';
import Button from '~/components/Button';
import Emoji from './Emoji';
import { commentService } from '~/services';
import { NotifyContextKey } from '~/contexts/NotifyContext';

const cx = classNames.bind(styles);

function CommentCreator({ videoInfo, setComments, isDeleted }) {
    // Context
    const showNotify = useContext(NotifyContextKey);

    // State
    const [isShowCharCount, setIsShowCharCount] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [loading, setLoading] = useState(false);

    const maxValueLength = 150;

    // Ref
    const inputRef = useRef();
    const defaultInputHeight = useRef();

    // Get default height of input
    useEffect(() => {
        defaultInputHeight.current = inputRef.current.offsetHeight;
    }, []);

    useEffect(() => {
        const element = inputRef.current;
        // Set height follow content
        element.style.height = 'auto';
        const scrollHeight = element.scrollHeight;
        element.style.height = scrollHeight + 'px';

        // Show char count or not
        const shouldShowCharCount = scrollHeight > defaultInputHeight.current;
        shouldShowCharCount !== isShowCharCount && setIsShowCharCount(shouldShowCharCount);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentValue]);

    const handleChangeInput = (e) => {
        const element = e.target;
        const value = element.value;

        // Update commentValue state
        value.startsWith(' ') || (value.length <= maxValueLength && setCommentValue(value));
    };

    const handleCreateComment = async () => {
        if (isDeleted) {
            showNotify('Video này hiện không tồn tại!');
            return;
        }

        if (loading || !commentValue) {
            return;
        }

        setLoading(true);
        const dataComment = await commentService.create(videoInfo.id, commentValue);
        setLoading(false);

        // Success
        if (dataComment) {
            // Update comments
            setComments((prevComments) => {
                const newComments = [dataComment, ...prevComments];
                return newComments;
            });

            // Update video data
            videoInfo.comments_count++;

            // Reset input
            setCommentValue('');
            inputRef.current.focus();

            // Show notifiy
            showNotify('Đã đăng bình luận!', 3000);
        } else {
            showNotify('Không thể bình luận. Vui lòng thử lại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('input-container')}
                onClick={() => {
                    // Focus input when user click the input container
                    inputRef.current.focus();
                }}
            >
                <textarea
                    ref={inputRef}
                    rows="1"
                    className={cx('content-input')}
                    value={commentValue}
                    placeholder="Thêm bình luận..."
                    spellCheck={false}
                    onChange={handleChangeInput}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.keyCode === 13) {
                            e.preventDefault();
                            // Submit
                            handleCreateComment();
                        }
                    }}
                ></textarea>
                {isShowCharCount && (
                    <p
                        className={cx('char-count', {
                            full: commentValue.length >= maxValueLength,
                        })}
                    >
                        {commentValue.length}/{maxValueLength}
                    </p>
                )}

                {/* Emoji Btn */}
                <Emoji maxValueLength={maxValueLength} setCommentValue={setCommentValue} />
            </div>
            <Button
                className={cx('submit-btn', {
                    disable: loading || !commentValue,
                })}
                disable={loading || !commentValue}
                onClick={handleCreateComment}
            >
                Đăng
            </Button>
        </div>
    );
}

export default CommentCreator;
