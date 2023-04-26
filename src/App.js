import { Fragment, useLayoutEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getCurrentUser } from './redux/slices/authSlice';
import { publicRoutes } from './routes';
import { DefaultLayout } from './layouts';
import ScrollToTop from './components/ScrollToTop';
import ContextProvider from './contexts/ContextProvider';
import { useLocalStorage } from './hooks';

function App() {
    const { dataStorage } = useLocalStorage();
    const dispatch = useDispatch();

    // State
    const [isLoadUser, setIsLoadUser] = useState(true);

    // Get currrent user if user was login
    useLayoutEffect(() => {
        if (dataStorage.token) {
            const loadUser = dispatch(getCurrentUser());

            loadUser.finally(() => {
                setIsLoadUser(false);
            });
        } else {
            setIsLoadUser(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return isLoadUser ? null : (
        <HashRouter>
            <ContextProvider>
                <div className="App">
                    <ScrollToTop />
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            // component
                            const Page = route.component;
                            // Layout
                            let Layout = DefaultLayout;
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout {...route.options}>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </ContextProvider>
        </HashRouter>
    );
}

export default App;
