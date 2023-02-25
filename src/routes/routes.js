import { FullSpace, FollowingLayout, HeaderOnly } from '~/layouts';
import { Home, Following, Upload, Profile, Live, SearchDetails, Video, Hashtag, PageNotFound } from '~/Pages';
import configs from '~/configs';

const publicRoutes = [
    { path: configs.routes.home, component: Home },
    { path: configs.routes.following, component: Following, layout: FollowingLayout },
    { path: configs.routes.profile, component: Profile, layout: FullSpace },
    { path: configs.routes.upload, component: Upload, layout: HeaderOnly },
    { path: configs.routes.live, component: Live, layout: FullSpace },
    { path: configs.routes.search, component: SearchDetails },
    { path: configs.routes.video, component: Video },
    { path: configs.routes.hashtag, component: Hashtag, layout: FullSpace, options: { suggestedAccount: false } },
    { path: configs.routes.notFound, component: PageNotFound, layout: HeaderOnly },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
