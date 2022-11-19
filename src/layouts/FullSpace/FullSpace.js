import classNames from 'classnames/bind';

import styles from './FullSpace.module.scss';
import { Header, Sidebar } from '../layoutComponents';
import DownloadApp from '~/components/DownloadApp';

const cx = classNames.bind(styles);

function FullSpace({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('sidebar')}>
                    <Sidebar />
                </div>
                <div className={cx('content-wrapper')}>
                    <section className={cx('content')}>{children}</section>
                </div>
            </div>

            <DownloadApp />
        </div>
    );
}

export default FullSpace;
