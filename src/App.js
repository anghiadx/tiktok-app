import { Fragment } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { DefaultLayout } from './layouts';
import ScrollToTop from './components/ScrollToTop';

import ModalProvider from '~/contexts/ModalContext';
import VideoModalProvider from './contexts/VideoModalContext';

function App() {
    return (
        <HashRouter>
            <ModalProvider>
                <VideoModalProvider>
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
                </VideoModalProvider>
            </ModalProvider>
        </HashRouter>
    );
}

export default App;
