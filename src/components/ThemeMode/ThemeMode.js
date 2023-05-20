import { useState, useEffect } from 'react';
import { useLocalStorage } from '~/hooks';
import Switch from '../Switch';

function ThemeMode() {
    const { dataStorage, setDataStorage } = useLocalStorage();
    const [isDarkMode, setIsDarkMode] = useState(dataStorage.theme === 'dark');

    const themeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        const themeData = {
            theme: 'light',
        };

        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeData.theme = 'dark';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }

        setDataStorage(themeData);
    }, [isDarkMode, setDataStorage]);

    return <Switch isOn={isDarkMode} handleToggle={themeToggle} />;
}

export default ThemeMode;
