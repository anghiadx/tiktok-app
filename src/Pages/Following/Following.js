import { useState, useLayoutEffect } from 'react';
import classNames from 'classnames/bind';
import { InView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import styles from './Following.module.scss';
import SuggestFollow from './SuggestFollow';
import { videoService } from '~/services';
import SvgIcon from '~/components/SvgIcon';
import TiktokLoading from '~/components/Loadings/TiktokLoading';
import HomeAccountLoading from '~/components/Loadings/HomeAccountLoading';
import SuggestVideo from '~/components/Videos/SuggestVideo';

const cx = classNames.bind(styles);

function Following() {
    // Redux
    const { isAuth } = useSelector((state) => state.auth);

    // State
    const [videoList, setVideoList] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fullList, setFullList] = useState(false);

    // Call API to load video list
    useLayoutEffect(() => {
        if (page < 1) return;

        const getVideoList = async () => {
            setLoading(true);
            const result = await videoService.getSuggestVideo(page, 'following');
            setLoading(false);

            if (result.length === 0) {
                setFullList(true);
            } else {
                // random video in list result
                result.sort(() => Math.random() - 0.5);
            }

            setVideoList([...videoList, ...result]);
        };

        getVideoList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // If user is not logined or without any suggest video -> show SuggestFollow component
    return !isAuth || (!loading && videoList.length < 5 && page === 1) ? (
        <div className={cx('wrapper')}>
            <SuggestFollow />
        </div>
    ) : (
        <div className={cx('video-wrapper')}>
            <SuggestVideo data={videoList} />

            {!fullList && (
                <InView onChange={(inView) => inView && !loading && setPage(page + 1)}>
                    {videoList.length === 0 ? (
                        <HomeAccountLoading />
                    ) : (
                        <SvgIcon className={cx('auto-load-more')} icon={<TiktokLoading />} />
                    )}
                </InView>
            )}
        </div>
    );
}

export default Following;
