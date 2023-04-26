import configs from '~/configs';

const key = configs.localStorage.key;

function useLocalStorage() {
    const getItem = () => {
        const dataStorage = JSON.parse(localStorage.getItem(key)) || {};
        return dataStorage;
    };

    const setItem = (objSet) => {
        const dataStorage = getItem();
        Object.assign(dataStorage, objSet);

        // convert data storage to json
        const jsonData = JSON.stringify(dataStorage);

        return localStorage.setItem(key, jsonData);
    };

    const deleteItem = (item) => {
        const dataStorage = getItem();
        delete dataStorage[item];

        // convert data storage to json
        const jsonData = JSON.stringify(dataStorage);

        return localStorage.setItem(key, jsonData);
    };

    return {
        dataStorage: getItem(),
        setDataStorage: setItem,
        deleteStorage: deleteItem,
    };
}

export default useLocalStorage;
