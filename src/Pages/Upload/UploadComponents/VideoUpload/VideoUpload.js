import { useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './VideoUpload.module.scss';
import Button from '~/components/Button';
import SvgIcon from '~/components/SvgIcon/SvgIcon';
import { iconUpload } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function VideoUpload({ handleSelectFile, handleDropFile }) {
    // File ref
    const fileRef = useRef();

    const handleCancelDefault = (e) => {
        e.preventDefault();
    };

    return (
        <div
            className={cx('file-container')}
            onDragOver={handleCancelDefault}
            onDrop={handleDropFile}
            onClick={() => {
                fileRef.current.click();
            }}
        >
            {/* Upload icon */}
            <SvgIcon icon={iconUpload} />

            <h3 className={cx('title')}>Chọn video để tải lên</h3>
            <p className={cx('descript')}>Hoặc kéo và thả tập tin</p>
            <p className={cx('detail-descript')}>MP4 hoặc WebM</p>
            <p className={cx('detail-descript')}>Độ phân giải 720x1280 trở lên</p>
            <p className={cx('detail-descript')}>Tối đa 30 phút</p>
            <p className={cx('detail-descript')}>Nhỏ hơn 2 GB</p>
            <Button className={cx('upload-btn')} color>
                Chọn tập tin
            </Button>

            <input ref={fileRef} type="file" accept="video/*" onChange={handleSelectFile} hidden />
        </div>
    );
}

export default VideoUpload;
