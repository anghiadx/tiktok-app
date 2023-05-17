import { httpRequest } from '~/utils';
import dataTemp from '~/temp/data';

const commentPath = (videoId) => {
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
    const dataResponse = await httpRequest.get(commentPath(videoId), options);
    return dataResponse.data;
};

export const create = async (videoId, comment = '') => {
    const dataResponse = await httpRequest.post(commentPath(videoId), {
        comment: comment,
    });

    return dataResponse.data;
};

export const dele = async (commentId) => {
    const dataResponse = await httpRequest.dele(`comments/${commentId}`);
    return dataResponse;
};
