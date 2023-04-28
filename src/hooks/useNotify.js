import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Notify from '~/components/Notify';

function useNotify() {
    // const [isShow, setIsShow] = useState(false);
    const [notify, setNotify] = useState('');
    const [divWrapper, setDivWrapper] = useState(true);

    const setTimeRef = useRef();

    const showNotify = (notify) => {
        setNotify(notify);
        clearTimeout(setTimeRef.current);
        setDivWrapper(!divWrapper);

        // Auto close notify after 4s
        setTimeRef.current = setTimeout(() => {
            setNotify('');
        }, 4000);
    };

    const NotifyComponent = () => {
        const PortalWrapper = divWrapper ? 'div' : 'p';
        return (
            notify &&
            createPortal(
                <PortalWrapper>
                    <Notify>{notify}</Notify>
                </PortalWrapper>,
                document.body,
            )
        );
    };

    return { showNotify, NotifyComponent };
}

export default useNotify;
