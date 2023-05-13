import { useState, useEffect, memo } from 'react';
import classNames from 'classnames/bind';

import styles from './FollowingAccount.module.scss';
import ShowAccount from '~/components/ShowAccount';
import BorderTopContainer from '~/components/BorderTopContainer';
import { followService } from '~/services';

const cx = classNames.bind(styles);

function FollowingAccount() {
    const [accountList, setAccountList] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fulled, setFulled] = useState(false);
    const [seeMore, setSeeMore] = useState(true);

    const currentList = seeMore ? accountList : accountList.slice(0, 10);
    const btnTitle = seeMore && fulled ? 'Ẩn bớt' : 'Xem thêm';

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true);
            const result = await followService.getFollowings(page);

            result.length !== 0 ? setAccountList([...accountList, ...result]) : setFulled(true);
            setLoading(false);
        };

        fetchAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleLoadMore = () => {
        return setPage(page + 1);
    };

    const handleShowHide = () => {
        return setSeeMore(!seeMore);
    };

    const handleClick = !fulled ? handleLoadMore : handleShowHide;

    const options = {
        btnTitle,
        loading,
    };

    return (
        // In case of not following anyone, ShowAccount will not be displayed
        page === 1 && fulled ? (
            <BorderTopContainer className={cx('no-followed')}>
                <h2 className={cx('title')}>Các tài khoản đang follow</h2>
                <p className={cx('content')}>Những tài khoản bạn follow sẽ xuất hiện tại đây</p>
            </BorderTopContainer>
        ) : (
            <ShowAccount
                title="Các tài khoản đang follow"
                accountItems={currentList}
                onClick={handleClick}
                {...options}
            />
        )
    );
}

export default memo(FollowingAccount);
