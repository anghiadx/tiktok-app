import classNames from 'classnames/bind';
import styles from './FollowingLayout.module.scss';
import { Header, Sidebar } from '../layoutComponents';
import DownloadApp from '~/components/DownloadApp';

const cx = classNames.bind(styles);

function FollowingLayout({ children }) {
    const currentUser = false;

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('sidebar')}>
                    {currentUser ? <Sidebar /> : <Sidebar suggestedAcc={false} followingAcc={false} />}
                </div>
                <div className={cx('content')}>{children}</div>
            </div>
            <DownloadApp />
        </div>
    );
}

export default FollowingLayout;
