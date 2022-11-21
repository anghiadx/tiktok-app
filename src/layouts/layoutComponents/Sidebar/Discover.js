import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import BorderTopContainer from '~/components/BorderTopContainer';
import Button from '~/components/Button';
import SvgIcon from '~/components/SvgIcon';
import { iconTag, iconMusic } from '~/components/SvgIcon/iconsRepo';
import LineLoading from '~/components/Loadings/LineLoading';
import dataTemp from '~/temp/data';

const cx = classNames.bind(styles);

function Discover() {
    const [discoverList, setDiscoverList] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setDiscoverList(dataTemp.discover);
        }, 3000);
    }, []);

    return (
        <BorderTopContainer className={cx('discover-container')}>
            <h3 className={cx('title')}>Khám phá</h3>
            <section className={cx('content')}>
                {discoverList.map((disItem, index) => {
                    const isHashtag = disItem.type === 'hashtag';
                    return (
                        <Button
                            key={index}
                            className={cx('btn', {
                                hashtag: isHashtag,
                            })}
                            primary
                            xsmall
                            rounded
                            leftIcon={<SvgIcon icon={isHashtag ? iconTag : iconMusic} />}
                        >
                            {disItem.title}
                        </Button>
                    );
                })}
                {discoverList.length < 1 && (
                    <>
                        <LineLoading />
                        <LineLoading />
                    </>
                )}
            </section>
        </BorderTopContainer>
    );
}

export default Discover;
