import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './SuggestFollow.module.scss';
import VideoPreview from '~/components/Videos/VideoPreview';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import VideoLoading from '~/components/Loadings/VideoLoading';
import { ModalContextKey } from '~/contexts/ModalContext';
import { accountService } from '~/services';

const cx = classNames.bind(styles);

function SuggestFollow() {
    const [dataSuggest, setData] = useState([]);
    const [playId, setPlayId] = useState(0);

    const { loginModalShow } = useContext(ModalContextKey);

    const defaultLoading = Array(15).fill();

    useEffect(() => {
        const getSuggestFollow = async () => {
            const dataResponse = await accountService.getSuggestedAccount(15);
            setData(dataResponse);
        };
        getSuggestFollow();
    }, []);

    const handleFollow = (e) => {
        e.preventDefault();
        loginModalShow();
    };

    const renderSuggestList = () => {
        const dataRender = dataSuggest.map((userInfo, index) => {
            const {
                avatar: avatarUrl,
                nickname: username,
                first_name: firstName,
                last_name: lastName,
                tick,
                popular_video: popularVideo,
            } = userInfo;

            return (
                <div key={index} className={cx('suggest-item')}>
                    <Link className={cx('content-wrapper')} to={`/@${username}`} target="_blank">
                        <VideoPreview videoId={index} data={popularVideo} playIdState={[playId, setPlayId]}>
                            <div className={cx('short-info')}>
                                <Img className={cx('info__avatar')} src={avatarUrl} />
                                <h2 className={cx('info__fullname')}>{`${firstName} ${lastName}`}</h2>
                                <h4 className={cx('info__username')}>
                                    {username}
                                    <ShowTick tick={tick} size={12} />
                                </h4>
                                <Button className={cx('info__follow-btn')} color medium onClick={handleFollow}>
                                    Follow
                                </Button>
                            </div>
                        </VideoPreview>
                    </Link>
                </div>
            );
        });
        return dataRender;
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('suggest-list')}>
                {dataSuggest.length === 0
                    ? defaultLoading.map((val, index) => {
                          return (
                              <div key={index} className={cx('suggest-item')}>
                                  <VideoLoading />
                              </div>
                          );
                      })
                    : renderSuggestList()}
            </div>
        </div>
    );
}

export default SuggestFollow;
