import { httpRequest } from '~/utils';
import dataTemp from '~/temp/data';

const getCommentPath = (videoId) => {
    return `videos/${videoId}/comments`;
};

// Fake logged in user to get comments
const token = dataTemp.fakeToken;

const options = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

export const get = async (videoId) => {
    const dataResponse = await httpRequest.get(getCommentPath(videoId), options);
    return dataResponse.data;
};
