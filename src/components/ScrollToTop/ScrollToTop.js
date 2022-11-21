import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname, search } = useLocation();
    const path = pathname + search;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [path]);

    return null;
}
export default ScrollToTop;
