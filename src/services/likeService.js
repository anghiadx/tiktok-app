import { httpRequest } from '~/utils';

const videoPath = 'videos/';
const commentPath = 'comments/';

export const likeVideo = async (id) => {
    const dataResponse = await httpRequest.post(videoPath + id + '/like');
    return dataResponse.data;
};

export const unlikeVideo = async (id) => {
    const dataResponse = await httpRequest.post(videoPath + id + '/unlike');
    return dataResponse.data;
};

export const likeComment = async (commentId) => {
    const dataResponse = await httpRequest.post(commentPath + commentId + '/like');
    return dataResponse.data;
};

export const unlikeComment = async (commentId) => {
    const dataResponse = await httpRequest.post(commentPath + commentId + '/unlike');
    return dataResponse.data;
};
