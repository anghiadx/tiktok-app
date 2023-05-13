import { httpRequest } from '~/utils';

export const follow = async (userId) => {
    const dataResponse = await httpRequest.post(`users/${userId}/follow`);
    return dataResponse.data;
};

export const unfollow = async (userId) => {
    const dataResponse = await httpRequest.post(`users/${userId}/unfollow`);
    return dataResponse.data;
};

export const getFollowings = async (page) => {
    const dataResponse = await httpRequest.get(`me/followings?page=${page}`);
    return dataResponse.data;
};
