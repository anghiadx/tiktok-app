import classNames from 'classnames/bind';
import styles from './Hashtag.module.scss';
import NotFoundNotify from '~/components/NotFound/NotFoundNotify';
import SvgIcon from '~/components/SvgIcon';
import { iconHashtag } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function Hashtag() {
    return (
        <div className={cx('wrapper')}>
            <NotFoundNotify
                title="Không thể tìm thấy hashtag này"
                content="Bạn đang tìm kiếm video? Hãy thử duyệt tìm các tác giả, hashtag và âm thanh thịnh hành của chúng tôi."
                icon={
                    <SvgIcon
                        icon={iconHashtag}
                        size={90}
                        style={{ display: 'inline-block', opacity: 0.34, marginBottom: 16 }}
                    />
                }
            />
        </div>
    );
}

export default Hashtag;
