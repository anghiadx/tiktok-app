import { Fragment, useLayoutEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getCurrentUser } from './redux/slices/authSlice';
import { publicRoutes, privateRoutes } from './routes';
import { DefaultLayout } from './layouts';
import ScrollToTop from './components/ScrollToTop';
import ContextProvider from './contexts/ContextProvider';
import { useLocalStorage } from './hooks';
import PrivateRoute from './routes/PrivateRoute';

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

    const renderRoutes = (route, index) => {
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
    };

    return isLoadUser ? null : (
        <HashRouter>
            <ContextProvider>
                <div className="App">
                    <ScrollToTop />
                    <Routes>
                        {publicRoutes.map(renderRoutes)}
                        <Route element={<PrivateRoute />}>{privateRoutes.map(renderRoutes)}</Route>
                    </Routes>
                </div>
            </ContextProvider>
        </HashRouter>
    );
}

export default App;
