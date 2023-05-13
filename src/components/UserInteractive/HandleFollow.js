import { cloneElement, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ModalContextKey } from '~/contexts/ModalContext';
import { NotifyContextKey } from '~/contexts/NotifyContext';
import { addFollowedId, removeFollowedId } from '~/redux/slices/followedSlice';
import { followService } from '~/services';

function HandleFollow({ followElement, followedElement, defaultFollowed, userId, preventDefault = false }) {
    // Context
    const { loginModalShow } = useContext(ModalContextKey);
    const showNotify = useContext(NotifyContextKey);

    // Redux
    const dispatch = useDispatch();
    const { isAuth } = useSelector((state) => state.auth);
    const { followedId } = useSelector((state) => state.followed);

    // State
    const [loading, setLoading] = useState(false);

    const isFollowed = followedId.includes(userId);

    // Clone Element
    const followElementClone = cloneElement(followElement, {
        onClick: handleClick,
        disable: loading,
    });
    const followedElementClone = cloneElement(followedElement, {
        onClick: handleClick,
        disable: loading,
    });

    useEffect(() => {
        if (defaultFollowed) {
            dispatch(addFollowedId(userId));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleClick(e) {
        preventDefault && e.preventDefault();

        if (!isAuth) {
            return loginModalShow();
        }

        if (isFollowed) {
            setLoading(true);
            const dataUnfollow = await followService.unfollow(userId);
            setLoading(false);

            dataUnfollow ? dispatch(removeFollowedId(userId)) : showNotify('Bỏ Follow thất bại. Vui lòng thử lại!');
        } else {
            setLoading(true);
            const dataFollow = await followService.follow(userId);
            setLoading(false);

            dataFollow ? dispatch(addFollowedId(userId)) : showNotify('Follow thất bại. Vui lòng thử lại!');
        }
    }

    return isAuth && isFollowed ? followedElementClone : followElementClone;
}

export default HandleFollow;
