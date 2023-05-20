export function timeToPercent(time, totalTime) {
    return (time / totalTime) * 100;
}

export function percentToTime(percent, totalTime) {
    return (totalTime / 100) * percent;
}

export function timeFormat(time) {
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const secondsStr = seconds < 10 ? `0${seconds}` : seconds;

    return minutesStr + ':' + secondsStr;
}
