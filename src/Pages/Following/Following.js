import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import styles from './Following.module.scss';
import SuggestFollow from './SuggestFollow';

const cx = classNames.bind(styles);

function Following() {
    const { isAuth } = useSelector((state) => state.auth);

    return <div className={cx('wrapper')}>{!isAuth ? <SuggestFollow /> : <h1>User Logined...</h1>}</div>;
}

export default Following;
