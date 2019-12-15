export function stringToCleanString(str) {
    return str ? (new Date(str)).toLocaleString().slice(0, 10) : ''
}
export function stringToDate(str) {
    str = str.split("/")
    return new Date(+str[2], str[1] - 1, +str[0])
}
export function dateToString(date) {
    return date ? (new Date(date)).toISOString().slice(0, 10) : ''
}
export function isMajor(birthdate) {
    return Math.abs(new Date(Date.now() - (new Date(birthdate)).getTime()).getUTCFullYear() - 1970) >= 18
}