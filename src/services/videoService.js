import { httpRequest } from '~/utils';

const path = 'videos';

export const getSuggestVideo = async (page, type = 'for-you') => {
    const dataResponse = await httpRequest.get(path, {
        params: {
            type,
            page,
        },
    });
    if (dataResponse.status === 0) {
        return [];
    }
    return dataResponse.data;
};

export const upload = async (dataUpload) => {
    const dataResponse = await httpRequest.post(path, dataUpload);

    return dataResponse.data;
};

export const deleteVideo = async (videoId) => {
    const dataResponse = await httpRequest.dele(path + '/' + videoId);

    return dataResponse;
};
