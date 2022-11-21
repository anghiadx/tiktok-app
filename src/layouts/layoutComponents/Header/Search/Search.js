import { useState, useRef, useEffect, useLayoutEffect, memo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import TippyHeadless from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './Search.module.scss';
import SvgIcon from '~/components/SvgIcon';
import { iconClose, iconLoading, iconSearch } from '~/components/SvgIcon/iconsRepo';
import PopperWrapper from '~/components/Popper';
import SeachAccountItem from '~/components/Items/SearchAccountItem';
import configs from '~/configs';
import { useDebounce } from '~/hooks';
import { searchService } from '~/services';

const cx = classNames.bind(styles);

function Search() {
    const [searchInput, setSearchInput] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    // react router state
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();

    // Ref
    const searchInputRef = useRef();
    const formRef = useRef();

    const debouncedValue = useDebounce(searchInput, 800);

    // Change search value follow the URL
    useLayoutEffect(() => {
        const searchPath = configs.routes.search;
        if (pathname.startsWith(searchPath)) {
            const searchKey = searchParams.get('q');
            const keyValidate = searchKey?.trim();
            !!keyValidate && setSearchInput(keyValidate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Call API search
    useEffect(() => {
        if (!debouncedValue) {
            setSearchResult([]);
            return;
        }

        const fetchAPI = async () => {
            setLoading(true);

            const searchResult = await searchService.search(debouncedValue);

            setSearchResult(searchResult);
            setLoading(false);
        };

        fetchAPI();
    }, [debouncedValue]);

    // Handler function
    const handleChangeInput = (e) => {
        const valueInput = e.target.value;
        valueInput.startsWith(' ') || setSearchInput(valueInput);
    };

    const handleClearInput = useCallback((isFocus) => {
        setSearchInput('');
        if (isFocus === true) {
            searchInputRef.current.focus();
        }
    }, []);

    const handleBlurSearch = () => {
        searchInputRef.current.blur();
        return setShowSearch(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!!searchInput) {
            navigate(`${configs.routes.search}?q=${searchInput}`);
            handleBlurSearch();
        }
    };

    const renderSearchResult = (attrs) => (
        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('search-result__popper')}>
                <div className={cx('search-result__title')}>Tài khoản</div>
                {searchResult.map((accountItem, index) => (
                    <SeachAccountItem key={index} accountInfo={accountItem} onClick={handleClearInput} />
                ))}

                {/* Go to search details page */}
                <Link
                    className={cx('search-result__see-full')}
                    to={`${configs.routes.search}?q=${searchInput}`}
                    onClick={handleBlurSearch}
                >
                    Xem tất cả kết quả dành cho "{searchInput}"
                </Link>
            </PopperWrapper>
        </div>
    );

    return (
        // Interactive tippy element may not be accessible via keyboard navigation because it is not directly
        // after the reference element in the DOM source order.

        // Using a wrapper <span> tag around the reference element solves this by creating
        // a new parentNode context.
        <span>
            <TippyHeadless
                render={renderSearchResult}
                visible={showSearch && searchResult.length > 0 && !!searchInput}
                interactive
                onClickOutside={handleBlurSearch}
            >
                <form ref={formRef} className={cx('search-container')} onSubmit={handleSubmit}>
                    <input
                        type="search"
                        placeholder="Tìm kiếm tài khoản và video"
                        spellCheck="false"
                        value={searchInput}
                        ref={searchInputRef}
                        onChange={handleChangeInput}
                        onFocus={() => {
                            setShowSearch(true);
                        }}
                        onBlur={() => {
                            searchResult.length > 0 || handleBlurSearch();
                        }}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                        }}
                    />
                    <div className={cx('search-icon-wrapper')}>
                        {loading && (
                            <span className={cx('loading', 'lh0')}>
                                <SvgIcon icon={iconLoading} />
                            </span>
                        )}
                        {loading || (
                            <span className={cx('clear-btn', 'lh0')} onClick={() => handleClearInput(true)}>
                                <SvgIcon icon={iconClose} />
                            </span>
                        )}
                    </div>
                    {/* Search btn */}
                    <button
                        type="submit"
                        className={cx('search-btn', 'lh0')}
                        onMouseDown={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <SvgIcon icon={iconSearch} size={24} />
                    </button>
                </form>
            </TippyHeadless>
        </span>
    );
}

export default memo(Search);
