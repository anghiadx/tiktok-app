import classNames from 'classnames/bind';
import styles from './Following.module.scss';
import SuggestFollow from './SuggestFollow';

const cx = classNames.bind(styles);

function Following() {
    const currentUser = false;

    return <div className={cx('wrapper')}>{!currentUser ? <SuggestFollow /> : <h1>User Logined...</h1>}</div>;
}

export default Following;
