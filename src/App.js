import { Fragment } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { DefaultLayout } from './layouts';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <HashRouter>
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
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
