import { useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SearchDetails.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconArrowToBot2, iconErrorStyle } from '~/components/SvgIcon/iconsRepo';
import SearchAccountLoading from '~/components/Loadings/SearchAccountLoading';
import NotFoundNotify from '~/components/NotFound/NotFoundNotify';
import TiktokLoading from '~/components/Loadings/TiktokLoading';
import AccountResultItem from './AccountResultItem';
import { searchService } from '~/services';

const cx = classNames.bind(styles);

function Search() {
    // State
    const [page, setPage] = useState(1);
    const [searchResult, setSearchResult] = useState([]);
    const [isFull, setIsFull] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Ref
    const tabListRef = useRef();
    const tabLineRef = useRef();

    // Get search key
    const [searchParams] = useSearchParams();
    const searchKey = searchParams.get('q') || '';

    const defaultSearchLoading = Array(10).fill();

    let stopCallAPI = false;

    // Reset state when user searching with new key
    useEffect(() => {
        searchResult.length > 0 && setSearchResult([]);
        setIsFull(false);
        setPage(1);
        if (page > 1) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            stopCallAPI = true;
        }
    }, [searchKey]);

    // Call API
    useEffect(() => {
        if (!searchKey.trim() || stopCallAPI) {
            setIsLoading(false);
            return;
        }

        const fetchSearch = async () => {
            setIsLoading(true);

            const dataResponse = await searchService.search(searchKey, 'more', page);

            dataResponse?.length === 0 && setIsFull(true);
            setSearchResult((prev) => prev.concat(dataResponse));
            setIsLoading(false);
        };
        fetchSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKey, page]);

    // Set event for tab items
    useEffect(() => {
        const setLineByElement = (element) => {
            const offsetLeft = element.offsetLeft;
            const offsetWidth = element.offsetWidth;

            Object.assign(tabLineRef.current.style, {
                left: offsetLeft + 'px',
                width: offsetWidth + 'px',
            });
        };
        const setDefaultLine = () => {
            const tabActive = tabListRef.current.querySelector('.' + cx('active'));
            const elementChild = tabActive.firstElementChild;
            setLineByElement(elementChild);
        };
        setDefaultLine();
        // ====================================================================
        const tabElements = Array.from(tabListRef.current.children);
        tabElements.forEach((tabItem) => {
            tabItem.onmouseenter = (e) => {
                const elementChild = e.target.firstElementChild;
                setLineByElement(elementChild);
            };
            tabItem.onmouseleave = setDefaultLine;
        });
    }, []);

    return (
        <div className={cx('wrapper')}>
            <header className={cx('search__tab')}>
                <ul ref={tabListRef} className={cx('tab-list')}>
                    <li className={cx('tab-item')}>
                        <span>Top</span>
                    </li>
                    <li className={cx('tab-item', 'active')}>
                        <span>Tài khoản</span>
                    </li>
                    <li className={cx('tab-item')}>
                        <span>Video</span>
                    </li>
                </ul>
                <div ref={tabLineRef} className={cx('tab-line')}></div>
            </header>

            <section className={cx('search__result')}>
                <div className={cx('result-list')}>
                    {isLoading && searchResult.length === 0
                        ? defaultSearchLoading.map((val, index) => {
                              return <SearchAccountLoading key={index} />;
                          })
                        : searchResult.map((accountItem, index) => {
                              return <AccountResultItem key={index} data={accountItem} />;
                          })}
                </div>

                {/* Search not found */}
                {!isLoading && searchResult.length === 0 && (
                    <NotFoundNotify
                        icon={<SvgIcon icon={iconErrorStyle} size={72} style={{ color: 'rgb(128, 130, 133)' }} />}
                        title={`Không tìm thấy kết quả dành cho "${searchKey}"`}
                        content="Kiểm tra chính tả hoặc thử một tìm kiếm khác."
                    />
                )}

                {/* See more btn */}
                {!isFull && searchResult.length > 0 && (
                    <div className={cx('see-more')}>
                        {isLoading ? (
                            <SvgIcon
                                style={{ display: 'inline-block', transform: 'translateX(16px)' }}
                                icon={<TiktokLoading small />}
                            />
                        ) : (
                            <button className={cx('see-more-btn')} onClick={() => setPage(page + 1)}>
                                Tải thêm <SvgIcon style={{ marginLeft: 4 }} icon={iconArrowToBot2} />
                            </button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Search;
