import PropTypes from 'prop-types';
import { useState, useEffect, useMemo, useContext } from 'react';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import styles from './VideoProfile.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconLock, iconLockRegular, iconPlayRegular } from '~/components/SvgIcon/iconsRepo';
import VideoLoading from '~/components/Loadings/VideoLoading';
import VideoPreview from '~/components/Videos/VideoPreview';
import NotFoundNotify from '~/components/NotFound/NotFoundNotify';
import { useLocalStorage } from '~/hooks';
import { VideoModalContextKey } from '~/contexts/VideoModalContext';

const cx = classNames.bind(styles);

function VideoProfile({ user, data }) {
    const [playId, setPlayId] = useState(0);
    const [listType, setListType] = useState('videos');

    // redux
    const { volume } = useSelector((state) => state.video);

    // Modal video data
    const { setDataStorage } = useLocalStorage();
    const { propsVideoModal, setPropsVideoModal, videoModalState } = useContext(VideoModalContextKey);
    const [isVideoModalShow] = videoModalState;

    const [videos, likedVideos] = data || [];

    const currentList = useMemo(() => {
        switch (listType) {
            case 'liked-videos':
                return likedVideos;

            case 'videos':
            default:
                return videos;
        }
    }, [listType, videos, likedVideos]);

    const defaultVideoLoading = Array(12).fill();

    // Set volume value to localstorage when it changed
    useEffect(() => {
        const data = {
            volume: volume,
        };
        setDataStorage(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volume]);

    useEffect(() => {
        setPlayId(0);
        setListType('videos');
    }, [data]);

    // Set handler function for the video modal
    useEffect(() => {
        if (isVideoModalShow) {
            propsVideoModal.handleNextVideo = handleNextVideo;
            propsVideoModal.handlePrevVideo = handlePrevVideo;

            setPropsVideoModal({ ...propsVideoModal });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVideoModalShow]);

    // Function handler
    const handleSelectTab = (type) => {
        setListType(type);
    };

    // Modal video function handler
    const handleNextVideo = () => {
        setPlayId((currentId) => {
            const nextId = currentId + 1;
            if (nextId >= currentList.length) {
                return currentId;
            }
            const newProps = {
                index: nextId,
                data: currentList[nextId],
            };
            setPropsVideoModal({ ...propsVideoModal, ...newProps });
            return nextId;
        });
    };
    const handlePrevVideo = () => {
        setPlayId((currentId) => {
            const prevId = currentId - 1;
            if (prevId < 0) {
                return currentId;
            }
            const newProps = {
                index: prevId,
                data: currentList[prevId],
            };
            setPropsVideoModal({ ...propsVideoModal, ...newProps });
            return prevId;
        });
    };

    const renderVideos = () => {
        let dataRender;

        // Video is loading
        if (data === null) {
            dataRender = defaultVideoLoading.map((value, index) => {
                return (
                    <div key={index} className={cx('video-item')}>
                        <VideoLoading />
                    </div>
                );
            });
        }

        // Render video list
        else {
            dataRender = currentList.map((video, index) => {
                const { description, views_count: viewsCount } = video;
                return (
                    <div key={index} className={cx('video-item')}>
                        <div className={cx('item__content')}>
                            <VideoPreview videoId={index} playIdState={[playId, setPlayId]} data={video} modalActive />

                            <p className={cx('content__view-count')}>
                                <SvgIcon icon={iconPlayRegular} size={18} />
                                <strong>{viewsCount}</strong>
                            </p>
                        </div>
                        <p className={cx('item__title')}>{description}</p>
                    </div>
                );
            });
        }

        return dataRender;
    };

    return (
        <section className={cx('video-container')}>
            <div className={cx('tab-list')}>
                <div
                    className={cx('tab-item', { active: listType === 'videos' })}
                    onClick={() => handleSelectTab('videos')}
                >
                    Video
                </div>
                <div
                    className={cx('tab-item', { active: listType === 'liked-videos' })}
                    onClick={() => handleSelectTab('liked-videos')}
                >
                    <SvgIcon icon={iconLock} />
                    <span>Đã thích</span>
                </div>
                <div className={cx('tab-line')}></div>
            </div>

            {/* Empty data */}
            {currentList?.length === 0 ? (
                <>
                    {listType === 'videos' && (
                        <NotFoundNotify
                            title="Không có nội dung"
                            content="Người dùng này chưa đăng bất kỳ video nào."
                        />
                    )}
                    {listType === 'liked-videos' && (
                        <NotFoundNotify
                            title="Video đã thích của người dùng này ở trạng thái riêng tư"
                            content={`Các video được thích bởi ${user} hiện đang ẩn`}
                            icon={<SvgIcon style={{ opacity: 0.34 }} icon={iconLockRegular} size={90} />}
                        />
                    )}
                </>
            ) : (
                <div className={cx('video-list')}>{renderVideos()}</div>
            )}
        </section>
    );
}

VideoProfile.propTypes = {
    user: PropTypes.string,
    data: PropTypes.array,
};

export default VideoProfile;
