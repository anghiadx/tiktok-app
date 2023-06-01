import { useState, useEffect } from 'react';
import { InView } from 'react-intersection-observer';
import classNames from 'classnames/bind';
import styles from './CommentShow.module.scss';
import CommentLoading from '~/components/Loadings/CommentLoading';
import CommentItem from './CommentItem';
import { commentService } from '~/services';

const cx = classNames.bind(styles);

function CommentShow({ videoId, videoInfo, authorId, onCloseModal, commentState }) {
    const [comments, setComments] = commentState;
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const loadingComment = Array(9).fill();

    // Fake current user to get comment
    const isAuth = true;

    useEffect(() => {
        if (!isAuth) {
            return;
        }

        const fetchAPI = async () => {
            setLoading(true);
            const dataResponse = await commentService.get(videoId, page);
            setLoading(false);

            const dataOk = Array.isArray(dataResponse) ? dataResponse : [];

            dataOk.length > 0 ? setComments(comments.concat(dataOk)) : setIsEmpty(true);
        };
        fetchAPI();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId, page]);

    const renderComment = () => {
        return loading && comments.length === 0
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

            {/* Empty Comment */}
            {!loading && comments.length === 0 && (
                <p className={cx('empty-comment')}>Hãy là người đầu tiên bình luận!</p>
            )}

            {/* Loadmore element */}
            {!isEmpty && comments.length >= 10 && (
                <InView onChange={(inView) => inView && !loading && setPage(page + 1)}>
                    <CommentLoading />
                </InView>
            )}
        </div>
    );
}
export default CommentShow;
