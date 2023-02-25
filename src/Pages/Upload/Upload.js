import { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Upload() {
    const [noteInput, setNoteInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isTagFriend, setIsTagFriend] = useState(false);

    const maxNoteInput = 150;

    // REF
    const noteInputRef = useRef();
    const searchInputRef = useRef();

    return (
        <div className={cx('wrapper')}>
            <section className={cx('body')}>
                <div className={cx('inner')}>
                    <div className={cx('head-title')}>
                        <h2>Tải video lên</h2>
                        <p>Đăng video vào tài khoản của bạn</p>
                    </div>
                    <div className={cx('content')}>
                        <div className={cx('content__left')}>
                            {/* File container */}
                            <div className={cx('file-container')}>
                                <img
                                    src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/cloud-icon1.ecf0bf2b.svg"
                                    alt=""
                                />
                                <h3 className={cx('title')}>Chọn video để tải lên</h3>
                                <p className={cx('descript')}>Hoặc kéo và thả tập tin</p>
                                <p className={cx('detail-descript')}>MP4 hoặc WebM</p>
                                <p className={cx('detail-descript')}>Độ phân giải 720x1280 trở lên</p>
                                <p className={cx('detail-descript')}>Tối đa 30 phút</p>
                                <p className={cx('detail-descript')}>Nhỏ hơn 2 GB</p>

                                <Button className={cx('upload-btn')} color>
                                    Chọn tập tin
                                </Button>
                            </div>
                        </div>
                        <div className={cx('content__right')}>
                            <div className={cx('edit-container')}>
                                <img
                                    alt=""
                                    src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/divide_black.e1e40d5b.svg"
                                />
                                <div className={cx('edit__content')}>
                                    <strong className={cx('content__title')}>Chia video và chỉnh sửa</strong>
                                    <p className={cx('content__descript')}>
                                        Bạn có thể nhanh chóng phân chia video thành nhiều phần, loại bỏ các phần thừa
                                        và chuyển video ngang thành video dọc
                                    </p>
                                </div>
                                <Button className={cx('edit__btn')} color>
                                    Chỉnh sửa
                                </Button>
                            </div>
                            <div className={cx('container', 'note-container')}>
                                <div style={{ visibility: isTagFriend ? 'hidden' : 'visible' }}>
                                    <div className={cx('note__title')}>
                                        <span className={cx('container__title')}>Chú thích</span>
                                        <span className={cx('title__count')}>
                                            {noteInput.length} / {maxNoteInput}
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
                                                value.length <= maxNoteInput && setNoteInput(value);
                                            }}
                                        ></div>
                                        <div className={cx('input-control')}>
                                            <span
                                                className={cx('control')}
                                                onClick={() => {
                                                    setIsTagFriend(true);
                                                    setTimeout(() => searchInputRef.current.focus());
                                                }}
                                            >
                                                <img
                                                    src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/at.062a03e9.svg"
                                                    alt=""
                                                />
                                            </span>
                                            <span className={cx('control')}>
                                                <img
                                                    src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/hashtag.234f1b9c.svg"
                                                    alt=""
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tag friend */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        visibility: isTagFriend ? 'visible' : 'hidden',
                                    }}
                                >
                                    <p className={cx('container__title')}>@Bạn bè</p>
                                    <div className={cx('tag__input')}>
                                        <img
                                            className={cx('tag__icon')}
                                            src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/search.a65ed16d.svg"
                                            alt=""
                                        />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchInput}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSearchInput(value);
                                            }}
                                        />
                                        <img
                                            className={cx('tag__icon')}
                                            src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/close.ab98f6c7.svg"
                                            alt=""
                                            onClick={() => {
                                                setIsTagFriend(false);
                                                setSearchInput('');
                                                setTimeout(() => noteInputRef.current.focus());
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Upload;
