import { createContext } from 'react';

export const ModalContextKey = createContext();

function ModalContext({ children, value }) {
    return <ModalContextKey.Provider value={value}>{children}</ModalContextKey.Provider>;
}

export default ModalContext;
