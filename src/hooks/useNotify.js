import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Notify from '~/components/Notify';

function useNotify() {
    // const [isShow, setIsShow] = useState(false);
    const [notify, setNotify] = useState('');
    const [divWrapper, setDivWrapper] = useState(true);

    const setTimeRef = useRef();

    const showNotify = useCallback((notify, timeout = 2000) => {
        setNotify(notify);
        clearTimeout(setTimeRef.current);
        setDivWrapper((prev) => !prev);

        // Auto close notify after 3s
        setTimeRef.current = setTimeout(() => {
            setNotify('');
        }, timeout);
    }, []);

    const NotifyComponent = () => {
        const PortalWrapper = divWrapper ? 'div' : 'section';
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
