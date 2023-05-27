import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CommentShow.module.scss';
import CommentLoading from '~/components/Loadings/CommentLoading';
import CommentItem from './CommentItem';
import { commentService } from '~/services';

const cx = classNames.bind(styles);

function CommentShow({ videoId, videoInfo, authorId, onCloseModal, commentState }) {
    const [comments, setComments] = commentState;
    const [loading, setLoading] = useState(true);

    const loadingComment = Array(9).fill();

    // Fake current user to get comment
    const isAuth = true;

    useEffect(() => {
        if (!isAuth) {
            return;
        }

        const fetchAPI = async () => {
            setLoading(true);

            const dataResponse = await commentService.get(videoId);
            const dataOk = Array.isArray(dataResponse) ? dataResponse : [];

            setComments(dataOk);
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
            : comments.map((comment, index) => {
                  return (
                      <CommentItem
                          key={index}
                          index={index}
                          data={comment}
                          authorId={authorId}
                          videoInfo={videoInfo}
                          onCloseModal={onCloseModal}
                          setComments={setComments}
                      />
                  );
              });
    };

    return (
        <div className={cx('comment-list')}>
            {!isAuth ? (
                <p className={cx('no-login')}>Hãy đăng nhập để bình luận và xem bình luận của người khác!</p>
            ) : (
                renderComment()
            )}
        </div>
    );
}
export default CommentShow;
