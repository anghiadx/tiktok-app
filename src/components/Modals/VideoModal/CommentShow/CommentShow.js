import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CommentShow.module.scss';
import CommentLoading from '~/components/Loadings/CommentLoading';
import CommentItem from './CommentItem';
import { commentService } from '~/services';

const cx = classNames.bind(styles);

function CommentShow({ videoId, onCloseModal }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadingComment = Array(9).fill();

    const currentUser = false;

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const fetchAPI = async () => {
            setLoading(true);

            const dataResponse = await commentService.get(videoId);

            setComments(dataResponse);
            setLoading(false);
        };
        fetchAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    const renderComment = () => {
        return loading
            ? loadingComment.map((val, index) => {
                  return <CommentLoading key={index} />;
              })
            : comments.map((cmt, index) => {
                  return <CommentItem key={index} data={cmt} onCloseModal={onCloseModal} />;
              });
    };

    return (
        <div className={cx('comment-list')}>
            {!currentUser ? (
                <p className={cx('no-login')}>Hãy đăng nhập để bình luận và xem bình luận của người khác!</p>
            ) : (
                renderComment()
            )}
        </div>
    );
}
export default CommentShow;
