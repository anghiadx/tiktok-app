import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './VideoEdit.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconAddBlur, iconCut, iconSplit, iconSubtrackBlur } from '~/components/SvgIcon/iconsRepo';
import Button from '~/components/Button';
import { NotifyContextKey } from '~/contexts/NotifyContext';
import { timeFormat } from '~/funcHandler';

const cx = classNames.bind(styles);

function VideoEdit({ file, note }) {
    // State
    const [videoUrl, setVideoUrl] = useState('');
    const [totalTime, setTotalTime] = useState(0);

    // context
    const showNotify = useContext(NotifyContextKey);

    // Get url from file
    useEffect(() => {
        if (!file) {
            return;
        }

        const videoUrl = URL.createObjectURL(file);
        setVideoUrl(videoUrl);

        return () => {
            URL.revokeObjectURL(videoUrl);
        };
    }, [file]);

    const handleClick = () => {
        showNotify('Coming Soon!');
    };

    return (
        <div className={cx('wrapper')}>
            {/* Edit video */}
            <div className={cx('edit-video')}>
                <span className={cx('edit-left')}>1</span>
                <div className={cx('edit-center')}>
                    <video
                        src={videoUrl}
                        onLoadedData={function (e) {
                            const totalTime = e.target.duration;
                            setTotalTime(totalTime);
                        }}
                    />
                    <div className={cx('edit-info')}>
                        <p className={cx('edit-name')}>{note}</p>
                        <p className={cx('edit-time')}>
                            <span>00:00</span> - <span>{timeFormat(totalTime)}</span>
                            <span>{timeFormat(totalTime, true)}</span>
                        </p>
                    </div>
                </div>
                <div className={cx('edit-right')}>
                    <Button color leftIcon={<SvgIcon icon={iconCut} />} onClick={handleClick}>
                        Chỉnh sửa video
                    </Button>
                </div>
            </div>

            {/* Split video */}
            <div className={cx('split-video')}>
                <div className={cx('split-left')}>
                    <p className={cx('split-title')}>Tách thành nhiều phần để tăng khả năng hiển thị</p>
                    <p className={cx('split-count')}>
                        <span className={cx('split-control')}>
                            <SvgIcon icon={iconSubtrackBlur} />
                        </span>
                        <span className={cx('split-number')}>2</span>
                        <span className={cx('split-control')}>
                            <SvgIcon icon={iconAddBlur} />
                        </span>
                    </p>
                </div>
                <div className={cx('split-right')}>
                    <Button primary leftIcon={<SvgIcon icon={iconSplit} />} onClick={handleClick}>
                        Phân chia
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default VideoEdit;
