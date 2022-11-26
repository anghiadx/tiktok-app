import { httpRequest } from '~/utils';

const getCommentPath = (videoId) => {
    return `videos/${videoId}/comments/`;
};

export const get = async (videoId) => {
    const dataResponse = await httpRequest.get(getCommentPath(videoId));
    return dataResponse.data;
};
