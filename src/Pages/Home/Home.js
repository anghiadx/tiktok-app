import { useEffect, useRef, useState } from 'react';
import { InView } from 'react-intersection-observer';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import SuggestVideo from '~/components/Videos/SuggestVideo';
import TiktokLoading from '~/components/Loadings/TiktokLoading';
import HomeAccountLoading from '~/components/Loadings/HomeAccountLoading';
import SvgIcon from '~/components/SvgIcon';
import { videoService } from '~/services';

const cx = classNames.bind(styles);

function Home() {
    // State
    const [videoList, setVideoList] = useState([]);
    const [page, setPage] = useState(0);

    // Ref
    const pageRandom = useRef([]);

    // Call API to load video list
    useEffect(() => {
        if (page < 1) return;

        const fetchVideoList = async () => {
            const result = await videoService.getSuggestVideo(page);

            // random video in list result
            result.sort(() => Math.random() - 0.5);

            setVideoList([...videoList, ...result]);
        };

        fetchVideoList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleRandomPage = (min, max) => {
        const countPage = max + 1 - min;
        const randomList = pageRandom.current;
        let page;

        if (randomList.length >= countPage) {
            randomList.length === countPage && randomList.push(max);
            page = ++randomList[randomList.length - 1];

            return page;
        }

        do {
            page = Math.floor(Math.random() * countPage + min);
        } while (randomList.includes(page));

        randomList.push(page);

        return page;
    };

    return (
        <div className={cx('wrapper')}>
            <SuggestVideo data={videoList} />

            <InView onChange={(inView) => inView && setPage(handleRandomPage(1, 10))}>
                {videoList.length === 0 ? (
                    <HomeAccountLoading />
                ) : (
                    <SvgIcon className={cx('auto-load-more')} icon={<TiktokLoading />} />
                )}
            </InView>
        </div>
    );
}

export default Home;
