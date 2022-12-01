import { httpRequest } from '~/utils';

const getCommentPath = (videoId) => {
    return `videos/${videoId}/comments`;
};

// Fake logged in user to get comments
const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC90aWt0b2suZnVsbHN0YWNrLmVkdS52blwvYXBpXC9hdXRoXC9yZWdpc3RlciIsImlhdCI6MTY2OTgyMzczMywiZXhwIjoxNjcyNDE1NzMzLCJuYmYiOjE2Njk4MjM3MzMsImp0aSI6IkFhWmIzMklMOWY0M1dTWHIiLCJzdWIiOjQ0MTUsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.inNngzLpjz693sf57RvMMibtWL9WlrOOGDC0ekGVF50';

const options = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

export const get = async (videoId) => {
    const dataResponse = await httpRequest.get(getCommentPath(videoId), options);
    return dataResponse.data;
};
