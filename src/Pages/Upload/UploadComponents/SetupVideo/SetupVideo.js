import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import Button from '~/components/Button/Button';
import VideoCover from '../VideoCover';
import Popper from '~/components/Popper';
import SvgIcon from '~/components/SvgIcon';
import { iconHashtag, iconMusic, iconSmallArrow, iconTextWarning, iconTickBox } from '~/components/SvgIcon/iconsRepo';

import styles from './SetupVideo.module.scss';
import Switch from '~/components/Switch';
import VideoPreview from '../VideoPreview';
import VideoUpload from '../VideoUpload';
import VideoEdit from '../VideoEdit';
import { ModalContextKey } from '~/contexts/ModalContext';
import { NotifyContextKey } from '~/contexts/NotifyContext';
import { videoService } from '~/services';

const cx = classNames.bind(styles);

// Setup
const maxNoteInput = 250;
const maxMusicInput = 50;

const viewableData = [
    {
        type: 'Công khai',
        value: 'public',
    },
    {
        type: 'Bạn bè',
        value: 'friends',
    },
    {
        type: 'Riêng tư',
        value: 'private',
    },
];
const allowuserData = {
    Comment: true,
    Duet: true,
    Stitch: true,
};

function SetupVideo({ file, setFile, handleSelectFile, handleDropFile }) {
    // Redux
    const { currentUser } = useSelector((state) => state.auth);

    // State
    const [noteValue, setNoteValue] = useState(''); // Mô tả video
    const [musicValue, setMusicValue] = useState(`Nhạc nền - ${currentUser.first_name} ${currentUser.last_name}`); // Âm nhạc trong video
    const [showMusicInput, setShowMusicInput] = useState(false);
    const [viewId, setViewId] = useState(0); // Chế độ hiển thị
    const [viewableShow, setViewableShow] = useState(false);
    const [allowuser, setAllowuser] = useState(allowuserData); // Cho phép người dùng comment, duet hoặc stitch
    const [runcopyright, setRuncopyright] = useState(false); // Chạy kiểm tra bản quyền

    const [loading, setLoading] = useState(false);

    // REF
    const noteInputRef = useRef();
    const timeCoverRef = useRef(0);

    // Context
    const { confirmModalShow } = useContext(ModalContextKey);
    const showNotify = useContext(NotifyContextKey);

    useEffect(() => {
        if (!file) {
            return;
        }

        // Setup
        if (!noteValue) {
            const fileName = file.name;
            const dotIndex = fileName.lastIndexOf('.');
            const fileNameOk = fileName.slice(0, dotIndex);

            setNoteValue(fileNameOk);
            noteInputRef.current.innerText = fileNameOk;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

    const confirmStopSetup = () => {
        const dataConfirm = {
            content: (
                <div className={cx('confirm-modal-content')}>
                    <h2>Hủy bỏ bài đăng này?</h2>
                    <p>Video và tất cả chỉnh sửa sẽ bị hủy bỏ.</p>
                </div>
            ),

            apply: (
                <Button
                    to="/"
                    className={cx('confirm-modal-apply')}
                    onClick={() => {
                        showNotify('Bạn đã hủy bỏ bài đăng!');
                    }}
                >
                    Hủy bỏ
                </Button>
            ),
            cancel: <p className={cx('confirm-modal-cancel')}>Tiếp tục chỉnh sửa</p>,
        };

        confirmModalShow(dataConfirm);
    };

    const confirmUploadSuccess = () => {
        const dataConfirm = {
            content: (
                <div className={cx('confirm-sucess-content')}>
                    <h2>Video của bạn đã được tải lên TikTok!</h2>
                </div>
            ),

            apply: (
                <Button className={cx('confirm-sucess-apply')} onClick={handleResetState}>
                    Tải video khác lên
                </Button>
            ),
            cancel: (
                <Button
                    to={`/@${currentUser.nickname}`}
                    className={cx('confirm-sucess-cancel')}
                    onClick={() => {
                        showNotify('Video đã được đăng tải thành công!');
                    }}
                >
                    Xem hồ sơ
                </Button>
            ),
        };

        confirmModalShow(dataConfirm);
    };

    const handleResetState = () => {
        setFile(null);
        setNoteValue('');
        setMusicValue(`Nhạc nền - ${currentUser.first_name} ${currentUser.last_name}`);
        timeCoverRef.current = 0;
        noteInputRef.current.innerText = '';
    };

    const handleUploadVideo = () => {
        const dataUpload = new FormData();

        // append file
        dataUpload.append('upload_file', file);
        // description
        dataUpload.append('description', noteValue);
        // music
        musicValue && dataUpload.append('music', musicValue);
        // cover
        dataUpload.append('thumbnail_time', Math.floor(timeCoverRef.current));
        // Viewable
        dataUpload.append('viewable', viewableData[viewId].value);

        const fetchAPI = async () => {
            setLoading(true);
            const dataResponse = await videoService.upload(dataUpload);
            setLoading(false);

            // Upload success or not
            dataResponse
                ? confirmUploadSuccess()
                : showNotify('Có lỗi xảy ra trong quá trình đăng video. Vui lòng thử lại!');
        };

        fetchAPI();
    };

    return (
        <>
            {/* HEADER */}
            {file && <VideoEdit file={file} note={noteValue} />}

            {/* CONTENT */}
            <div className={cx('inner')}>
                <div className={cx('setup-container')}>
                    <div className={cx('head-title')}>
                        <h2>Tải video lên</h2>
                        <p>Đăng video vào tài khoản của bạn</p>
                    </div>
                    <div className={cx('content')}>
                        {/* LEFT CONTAINER */}
                        <div className={cx('content__left')}>
                            {/* File container */}
                            {file ? (
                                <VideoPreview
                                    file={file}
                                    setFile={setFile}
                                    videoDescription={noteValue}
                                    videoMusic={musicValue}
                                    currentUser={currentUser}
                                    loading={loading}
                                />
                            ) : (
                                <VideoUpload
                                    setFile={setFile}
                                    handleSelectFile={handleSelectFile}
                                    handleDropFile={handleDropFile}
                                />
                            )}
                        </div>

                        {/* RIGHT CONTAINER */}
                        <div className={cx('content__right')}>
                            <div className={cx('input-container')}>
                                {/* Chú thích */}
                                <div
                                    className={cx('note-container')}
                                    style={{ visibility: showMusicInput ? 'hidden' : 'visible' }}
                                >
                                    <div className={cx('note__title')}>
                                        <span className={cx('title')}>Chú thích</span>
                                        <span className={cx('title__count')}>
                                            {noteValue.length} / {maxNoteInput}
                                        </span>
                                    </div>
                                    <div className={cx('note__input')}>
                                        <div
                                            ref={noteInputRef}
                                            className={cx('input')}
                                            contentEditable
                                            spellCheck={false}
                                            onInput={(e) => {
                                                const value = e.target.innerText;
                                                if (value.length <= maxNoteInput) {
                                                    setNoteValue(value);
                                                } else {
                                                    e.target.innerText = noteValue;
                                                    showNotify('Tối đa ' + maxNoteInput + ' ký tự', 2000);
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        ></div>
                                        <div className={cx('input-control')}>
                                            <span
                                                className={cx('control')}
                                                onClick={() => setShowMusicInput(!showMusicInput)}
                                            >
                                                <SvgIcon icon={iconMusic} size={20} />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Âm nhạc trong video */}

                                <div
                                    className={cx('note-container', 'music-container')}
                                    style={{ visibility: showMusicInput ? 'visible' : 'hidden' }}
                                >
                                    <div className={cx('note__title')}>
                                        <span className={cx('title')}>Âm nhạc trong video</span>
                                        <span className={cx('title__count')}>
                                            {musicValue.length} / {maxMusicInput}
                                        </span>
                                    </div>
                                    <div className={cx('note__input')}>
                                        <input
                                            className={cx('input')}
                                            spellCheck={false}
                                            value={musicValue}
                                            placeholder="Tên bản nhạc trong video"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                value.length <= maxMusicInput
                                                    ? setMusicValue(value)
                                                    : showNotify('Tối đa ' + maxMusicInput + ' ký tự', 2000);
                                            }}
                                        />
                                        <div className={cx('input-control')}>
                                            <span
                                                className={cx('control')}
                                                onClick={() => setShowMusicInput(!showMusicInput)}
                                            >
                                                <SvgIcon icon={iconHashtag} size={20} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Anh bia */}
                            <div className={cx('cover-container')}>
                                <p className={cx('title')}>Ảnh bìa</p>
                                <VideoCover file={file} timeCoverRef={timeCoverRef} />
                            </div>

                            {/* Quyen rieng tu */}
                            <div>
                                <p className={cx('title')}>Ai có thể xem video này</p>
                                <Popper
                                    className={cx('viewable-popper')}
                                    render={
                                        <>
                                            {viewableData.map((viewInfo, index) => {
                                                return (
                                                    <Button
                                                        key={index}
                                                        className={cx('viewable-btn', {
                                                            active: index === viewId,
                                                        })}
                                                        onClick={() => {
                                                            setViewId(index);
                                                            setViewableShow(false);
                                                        }}
                                                    >
                                                        {viewInfo.type}
                                                    </Button>
                                                );
                                            })}
                                        </>
                                    }
                                    customTippy={{
                                        visible: viewableShow,
                                        placement: 'bottom-end',
                                        onClickOutside: () => setViewableShow(false),
                                        offset: [0, 6],
                                    }}
                                >
                                    <div
                                        className={cx('viewable-container')}
                                        onClick={() => setViewableShow(!viewableShow)}
                                    >
                                        <span>{viewableData[viewId].type}</span>
                                        <SvgIcon
                                            className={cx('arrow-icon', { rotate: viewableShow })}
                                            icon={iconSmallArrow}
                                            size={14}
                                        />
                                    </div>
                                </Popper>
                            </div>

                            {/* Cho phép người dùng */}
                            <div>
                                <p className={cx('title')}>Cho phép người dùng:</p>
                                <div className={cx('allow-user-container')}>
                                    {Object.keys(allowuser).map((key, index) => {
                                        const id = `checkbox-${Math.random() * 10000}`;
                                        return (
                                            <div key={index} className={cx('checkbox-group')}>
                                                <input
                                                    type="checkbox"
                                                    id={id}
                                                    hidden
                                                    checked={allowuser[key]}
                                                    onChange={(e) => {
                                                        const val = e.target.checked;
                                                        const newState = { ...allowuser };
                                                        newState[key] = val;
                                                        setAllowuser(newState);
                                                    }}
                                                />
                                                <label htmlFor={id}>
                                                    <p className={cx('checkbox-icon')}>
                                                        <SvgIcon icon={iconTickBox} size={12} />
                                                    </p>
                                                    {key}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Chạy quy trình kiểm tra bản quyền */}
                            <div className={cx('runcopyright-container')}>
                                <div style={{ display: 'flex' }}>
                                    <p className={cx('title')}>Chạy quy trình kiểm tra bản quyền</p>
                                    <Switch
                                        className={cx('switch')}
                                        isOn={runcopyright}
                                        handleToggle={() => setRuncopyright(!runcopyright)}
                                    />
                                </div>

                                <div className={cx('runcopyright-content')}>
                                    {runcopyright ? (
                                        <p className={cx('on')}>
                                            <SvgIcon icon={iconTextWarning} size={16} />
                                            <span>
                                                Kiểm tra bản quyền chỉ bắt đầu sau khi bạn tải video của mình lên.
                                            </span>
                                        </p>
                                    ) : (
                                        <p className={cx('off')}>
                                            Chúng tôi sẽ kiểm tra xem video của bạn có sử dụng âm thanh vi phạm bản
                                            quyền hay không. Nếu chúng tôi phát hiện có vi phạm, bạn có thể chỉnh sửa
                                            video trước khi đăng.<strong>Tìm hiểu thêm</strong>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* ĐĂNG */}
                            <div className={cx('submit-container')}>
                                <Button
                                    className={cx('submit-btn')}
                                    primary
                                    disable={loading}
                                    onClick={loading ? null : confirmStopSetup}
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    className={cx('submit-btn', {
                                        disable: !file || !noteValue,
                                    })}
                                    color
                                    loading={loading}
                                    disable={!file || !noteValue || loading}
                                    onClick={handleUploadVideo}
                                >
                                    Đăng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SetupVideo;
