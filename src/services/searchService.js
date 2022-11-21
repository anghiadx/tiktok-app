import { httpRequest } from '~/utils';

const path = 'users/search';

export const search = async (keyword, type = 'less', page = 1) => {
    const dataResponse = await httpRequest.get(path, {
        params: {
            q: keyword,
            type,
            page,
        },
    });
    return dataResponse.data;
};
