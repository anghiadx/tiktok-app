import configs from '~/configs';

const key = configs.localStorage.key;

function useLocalStorage() {
    const getItem = () => {
        const dataStorage = JSON.parse(localStorage.getItem(key)) || {};
        return dataStorage;
    };

    const setItem = (objSet) => {
        Object.assign(dataStorage, objSet);

        // convert data storage to json
        const jsonData = JSON.stringify(dataStorage);

        return localStorage.setItem(key, jsonData);
    };

    const dataStorage = getItem();

    return {
        dataStorage,
        setDataStorage: setItem,
    };
}

export default useLocalStorage;
