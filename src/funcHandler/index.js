export function timeToPercent(time, totalTime) {
    return (time / totalTime) * 100;
}

export function percentToTime(percent, totalTime) {
    return (totalTime / 100) * percent;
}

export function timeFormat(time, style2 = false) {
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    let timeStyle = '';

    if (style2) {
        timeStyle = minutes > 0 ? `${minutes}m${seconds}s` : `${seconds}s`;
    } else {
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
        timeStyle = minutesStr + ':' + secondsStr;
    }

    return timeStyle;
}
