import { useEffect, useRef, useState } from 'react';
import VideoSnapshot from 'video-snapshot';
import classNames from 'classnames/bind';
import styles from './VideoCover.module.scss';

const cx = classNames.bind(styles);

function VideoCover({ file, timeCoverRef }) {
    const [slideValue, setSlideValue] = useState(0);
    const [videoDuration, setVideoDuration] = useState();

    const [coverItems, setCoverItems] = useState(Array(8).fill(''));

    const videoSlideRef = useRef();

    // Create video url from file or reset state
    useEffect(() => {
        if (!file) {
            // Reset state
            setCoverItems(Array(8).fill(''));
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
        const aPart = videoDuration / 7;

        const getCoverItems = async (part) => {
            const previewUrl = await videoSnapshot.takeSnapshot(aPart * part);

            setCoverItems((prevItems) => {
                const newItems = [...prevItems];
                newItems[part] = previewUrl;

                return newItems;
            });

            part + 1 < 8 && getCoverItems(part + 1);
        };

        getCoverItems(0);
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
