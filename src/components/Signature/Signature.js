import classNames from 'classnames/bind';
import styles from './Signature.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import { signature } from '../SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function Signature({ size = 400, className }) {
    return (
        <div
            className={cx('wrapper', {
                [className]: className,
            })}
        >
            <SvgIcon icon={signature} size={size} />
        </div>
    );
}

export default Signature;
