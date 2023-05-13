import Lottie from 'lottie-react';
import { forwardRef } from 'react';

function LottieIcon({ className, icon, options }, ref) {
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: icon,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
        ...options,
    };

    return <Lottie lottieRef={ref} className={className} {...lottieOptions} />;
}

export default forwardRef(LottieIcon);
