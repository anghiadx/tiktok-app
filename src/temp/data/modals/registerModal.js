import SvgIcon from '~/components/SvgIcon';
import {
    iconFacebookShare,
    iconGoogle,
    iconKakaoTalk,
    iconLine,
    iconTwitter,
    iconUser,
} from '~/components/SvgIcon/iconsRepo';
import { RegisterWithEmail } from '~/components/Modals/LoginModal/Forms';

const registerModalData = {
    title: 'Đăng ký TikTok',
    data: [
        {
            title: 'Sử dụng số điện thoại hoặc Email',
            icon: <SvgIcon icon={iconUser} />,
            children: {
                title: 'Đăng ký',
                type: 'component',
                data: RegisterWithEmail,
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
    ],
};

export default registerModalData;
