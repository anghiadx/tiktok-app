function useLocalStorage(key) {
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

    return [dataStorage, setItem];
}

export default useLocalStorage;
