import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import Button from '~/components/Button';
import SetupVideo from './UploadComponents/SetupVideo';
import { NotifyContextKey } from '~/contexts/NotifyContext';
import SvgIcon from '~/components/SvgIcon/SvgIcon';
import { iconUpload } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function Upload() {
    const [file, setFile] = useState();

    // Context
    const showNotify = useContext(NotifyContextKey);

    // ref
    const fileRef = useRef();
    const keepSetup = useRef(false);

    // Giữ giao diện setup từ sau lần chọn file đầu tiên
    useEffect(() => {
        keepSetup.current = true;
    }, []);

    const handleSelectFile = useCallback((e) => {
        const [file] = e.target.files;

        if (file) {
            const fileValid = file?.type.startsWith('video/');

            fileValid ? setFile(file) : showNotify('Định dạng file không hỗ trợ. Vui lòng chọn lại!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteDefault = (e) => {
        e.preventDefault();
    };

    const handleDropFile = useCallback((e) => {
        e.preventDefault();
        const [file] = e.dataTransfer.files;

        if (file) {
            const fileValid = file?.type.startsWith('video/');

            fileValid ? setFile(file) : showNotify('Tập tin không được hỗ trợ. Hãy sử dụng định dạng MP4 hoặc WebM.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper')}>
            <section className={cx('body')}>
                {!keepSetup.current ? (
                    <div className={cx('inner')}>
                        <div className={cx('upload-container')}>
                            <div
                                className={cx('file-container')}
                                onDragOver={handleDeleteDefault}
                                onDrop={handleDropFile}
                                onClick={() => {
                                    fileRef.current.click();
                                }}
                            >
                                {/* Icon upload */}
                                <SvgIcon icon={iconUpload} />

                                <h3 className={cx('title')}>Chọn video để tải lên</h3>
                                <p className={cx('descript')}>Hoặc kéo và thả tập tin</p>
                                <p className={cx('descript')} style={{ marginBottom: 24 }}>
                                    Có thể tách video dài thành nhiều phần để tăng khả năng hiển thị
                                </p>
                                <p className={cx('detail-descript')}>MP4 hoặc WebM</p>
                                <p className={cx('detail-descript')}>Độ phân giải 720x1280 trở lên</p>
                                <p className={cx('detail-descript')}>Tối đa 30 phút</p>
                                <p className={cx('detail-descript')}>Nhỏ hơn 2 GB</p>
                                <Button className={cx('upload-btn')} color>
                                    Chọn tập tin
                                </Button>
                            </div>
                            <input ref={fileRef} type="file" accept="video/*" hidden onChange={handleSelectFile} />
                        </div>
                    </div>
                ) : (
                    <SetupVideo
                        file={file}
                        setFile={setFile}
                        handleSelectFile={handleSelectFile}
                        handleDropFile={handleDropFile}
                    />
                )}
            </section>
        </div>
    );
}

export default Upload;
