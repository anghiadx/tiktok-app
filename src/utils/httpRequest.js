import axios from 'axios';
import { useLocalStorage } from '~/hooks';

const request = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

const getRequestOptions = (options) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { dataStorage } = useLocalStorage();

    const headerOptions = options.header || {};

    const requestOptions = {
        ...options,

        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${dataStorage.token}`,
            ...headerOptions,
        },
    };

    return requestOptions;
};

export const get = async (path, options = {}) => {
    const requestOptions = getRequestOptions(options);

    try {
        const response = await request.get(path, requestOptions);

        return response.data;
    } catch (err) {
        console.log('Failed to get: ', err);
        return err.response;
    }
};

export const post = async (path, data, options = {}) => {
    const requestOptions = getRequestOptions(options);

    try {
        const response = await request.post(path, data, requestOptions);

        return response.data;
    } catch (err) {
        console.log('Failed to post: ', err);
        return err.response;
    }
};
