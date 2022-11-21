import PropTypes from 'prop-types';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './AccountResultItem.module.scss';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';

const cx = classNames.bind(styles);

function AccountResultItem({ data }) {
    const {
        avatar: avatarUrl,
        nickname: username,
        full_name: fullname,
        followers_count: followersCount,
        bio,
        tick,
    } = data;

    return (
        <Link className={cx('result-item')} to={`/@${username}`}>
            <Img className={cx('avatar')} src={avatarUrl} alt={fullname} />
            <div className={cx('body')}>
                <h3 className={cx('username')}>
                    {username}
                    <ShowTick tick={tick} />
                </h3>
                <p className={cx('info')}>
                    <span>{fullname}</span>
                    {' · '}
                    <strong className={cx('count-follower')}>{followersCount}</strong> Follower
                </p>
                <p className={cx('bio')}>{bio}</p>
            </div>
        </Link>
    );
}

AccountResultItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default memo(AccountResultItem);
