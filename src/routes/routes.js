import { FullSpace, FollowingLayout } from '~/layouts';
import { Home, Following, Upload, Profile, Live } from '~/Pages';
import configs from '~/configs';

const publicRoutes = [
    { path: configs.routes.home, component: Home },
    { path: configs.routes.following, component: Following, layout: FollowingLayout },
    { path: configs.routes.profile, component: Profile, layout: FullSpace },
    { path: configs.routes.upload, component: Upload, layout: null },
    { path: configs.routes.live, component: Live, layout: FullSpace },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
