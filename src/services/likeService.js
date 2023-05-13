import { httpRequest } from '~/utils';

const videoPath = 'videos/';
// const commentPath = 'comments/';

export const likeVideo = async (id) => {
    const dataResponse = await httpRequest.post(videoPath + id + '/like');
    return dataResponse.data;
};

export const unlikeVideo = async (id) => {
    const dataResponse = await httpRequest.post(videoPath + id + '/unlike');
    return dataResponse.data;
};
