import { httpRequest } from '~/utils';

const path = 'auth/';

export const login = async (loginData = {}) => {
    const response = await httpRequest.post(path + 'login', loginData);

    return response;
};

export const logout = async () => {
    const response = await httpRequest.post(path + 'logout');

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await httpRequest.get(path + 'me');

    return response.data;
};
