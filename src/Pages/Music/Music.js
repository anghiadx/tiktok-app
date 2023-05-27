import classNames from 'classnames/bind';
import styles from './Music.module.scss';
import NotFoundNotify from '~/components/NotFound/NotFoundNotify';
import SvgIcon from '~/components/SvgIcon';
import { iconBigMusic } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function Music() {
    return (
        <div className={cx('wrapper')}>
            <NotFoundNotify
                title="Trang không có sẵn"
                content="Bạn đang tìm kiếm video? Hãy thử duyệt tìm các tác giả, hashtag và âm thanh thịnh hành của chúng tôi."
                icon={
                    <SvgIcon
                        icon={iconBigMusic}
                        size={90}
                        style={{ display: 'inline-block', opacity: 0.34, marginBottom: 16 }}
                    />
                }
            />
        </div>
    );
}

export default Music;
