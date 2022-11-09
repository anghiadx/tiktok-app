import SvgIcon from '~/components/SvgIcon';
import {
    iconApple,
    iconFacebookShare,
    iconGoogle,
    iconInstagram,
    iconKakaoTalk,
    iconLine,
    iconQR,
    iconTwitter,
    iconUser,
} from '~/components/SvgIcon/iconsRepo';
import { LoginWithEmail, LoginWithQR } from '~/components/Modals/LoginModal/Forms';

const loginModalData = {
    title: 'Đăng nhập vào TikTok',
    data: [
        {
            title: 'Sử dụng mã QR',
            icon: <SvgIcon icon={iconQR} />,
            children: {
                title: 'Đăng nhập bằng mã QR',
                type: 'component',
                data: LoginWithQR,
            },
        },
        {
            title: 'Số điện thoại / Email / TikTok ID',
            icon: <SvgIcon icon={iconUser} />,
            children: {
                title: 'Đăng nhập',
                type: 'component',
                data: LoginWithEmail,
            },
        },
        {
            title: 'Tiếp tục với Facebook',
            icon: <SvgIcon icon={iconFacebookShare} />,
            disable: true,
        },
        {
            title: 'Tiếp tục với Google',
            icon: <SvgIcon icon={iconGoogle} />,
            disable: true,
        },
        {
            title: 'Tiếp tục với Twitter',
            icon: <SvgIcon icon={iconTwitter} />,
            disable: true,
        },
        {
            title: 'Tiếp tục với LINE',
            icon: <SvgIcon icon={iconLine} />,
            disable: true,
        },
        {
            title: 'Tiếp tục với KakaoTalk',
            icon: <SvgIcon icon={iconKakaoTalk} />,
            disable: true,
        },
        {
            title: 'Tiếp tục với Apple',
            icon: <SvgIcon icon={iconApple} />,
            disable: true,
        },
        {
            title: 'Tiếp tục với Instagram',
            icon: <SvgIcon icon={iconInstagram} />,
            disable: true,
        },
    ],
};

export default loginModalData;
