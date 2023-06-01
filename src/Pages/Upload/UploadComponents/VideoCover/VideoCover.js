import { useEffect, useRef, useState } from 'react';
import VideoSnapshot from 'video-snapshot';
import classNames from 'classnames/bind';
import styles from './VideoCover.module.scss';

const cx = classNames.bind(styles);

// Số ảnh bìa sẽ render
const coverItemsNum = 8;

// Thời gian delay sau mỗi lần render (ms)
const renderDelay = 100;

function VideoCover({ file, timeCoverRef }) {
    // State
    const [slideValue, setSlideValue] = useState(0);
    const [videoDuration, setVideoDuration] = useState();
    const [coverItems, setCoverItems] = useState(Array(coverItemsNum).fill(''));

    // Ref
    const videoSlideRef = useRef();

    // Create video url from file or reset state
    useEffect(() => {
        if (!file) {
            // Reset state
            setCoverItems(Array(coverItemsNum).fill(''));
            setSlideValue(0);
            return;
        }

        const videoUrl = URL.createObjectURL(file);
        videoSlideRef.current.src = videoUrl;

        return () => {
            URL.revokeObjectURL(videoUrl);
        };
    }, [file]);

    // Update video slide when slide value is changed
    useEffect(() => {
        if (!videoDuration || !file) {
            return;
        }
        const currentTime = (videoDuration / 100) * slideValue;
        videoSlideRef.current.currentTime = currentTime;
        // Update timeCover
        timeCoverRef.current = currentTime;
    }, [slideValue, videoDuration, timeCoverRef, file]);

    // Update slide background
    useEffect(() => {
        if (!videoDuration || !file) {
            return;
        }
        const videoSnapshot = new VideoSnapshot(file);
        const aPart = videoDuration / (coverItemsNum - 1);

        const getCoverItems = async () => {
            const tasks = [];

            for (let i = 0; i < coverItemsNum; i++) {
                tasks.push(videoSnapshot.takeSnapshot(aPart * i));
            }

            const previewUrls = await Promise.all(tasks);

            previewUrls.forEach((url, index) => {
                setTimeout(
                    () =>
                        setCoverItems((prevItems) => {
                            const newItems = [...prevItems];
                            newItems[index] = url;

                            return newItems;
                        }),
                    renderDelay * index,
                );
            });
        };

        getCoverItems();
    }, [videoDuration, file]);

    return (
        <section className={cx('wrapper')}>
            <div className={cx('cover-background')}>
                {file ? (
                    coverItems.map((item, index) => {
                        return (
                            <p key={index} className={cx('cover-item')} style={{ backgroundImage: `url(${item})` }}></p>
                        );
                    })
                ) : (
                    <p className={cx('cover-item', 'empty')}></p>
                )}
            </div>

            {/* Slider */}
            {file && (
                <div className={cx('cover-slider')}>
                    <div className={cx('cover-slider__track')} style={{ '--slide-data': slideValue + '%' }}>
                        <div className={cx('cover-slider__thumb')}>
                            <div className={cx('video-slider')}>
                                <video
                                    ref={videoSlideRef}
                                    onLoadedData={() => {
                                        const videoDuration = videoSlideRef.current.duration;
                                        videoDuration && setVideoDuration(videoDuration);
                                    }}
                                ></video>
                            </div>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={slideValue}
                        onChange={(e) => {
                            const val = +e.target.value;
                            setSlideValue(val);
                        }}
                    />
                </div>
            )}
        </section>
    );
}

export default VideoCover;
