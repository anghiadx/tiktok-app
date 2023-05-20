import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoute() {
    const { isAuth } = useSelector((state) => state.auth);

    return isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
