import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from '~/components/GlobalStyle';
import ModalProvider from '~/contexts/ModalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    //<React.StrictMode>
    <GlobalStyle>
        <ModalProvider>
            <App />
        </ModalProvider>
    </GlobalStyle>,
    //</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Hello world
console.log(
    '%cHế lô 🙋!! Nếu có bất kì thắc mắc hay đóng góp nào, hãy liên hệ với mình bằng cách quét mã QR trong mục "Đăng nhập bằng mã QR" nhé!! %cLove you 3000 <3',
    'font-weight: bold; font-size: 14px; margin-top: 8px',
    'font-weight: bold; font-size: 14px; color: #fe2c55; margin: 8px 0',
);
