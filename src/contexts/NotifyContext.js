import { createContext } from 'react';
import useNotify from '~/hooks/useNotify';

export const NotifyContextKey = createContext();

function NotifyContext({ children }) {
    const { showNotify, NotifyComponent } = useNotify();

    return (
        <NotifyContextKey.Provider value={showNotify}>
            {children}
            <NotifyComponent />
        </NotifyContextKey.Provider>
    );
}

export default NotifyContext;
