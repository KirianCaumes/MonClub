//Convert date (string) to be displayed in string : "DD/MM/YYYY"
export function stringToCleanString(str) {
    return str ? (new Date(str)).toLocaleString().slice(0, 10) : ''
}

//Convert date (string) to be displayed in string : "DD/MM"
export function stringToShortCleanString(str) {
    return str ? (new Date(str)).toLocaleString().slice(0, 5) : ''
}

//Convert date (string : DD/MM/YYYY) to date (object) : Date
export function stringToDate(str) {
    str.replace('_', '')
    str = str.split('/')
    let dt = new Date(+str[2], str[1] - 1, +str[0])
    return dt instanceof Date && !isNaN(dt) ? dt : null
}

//Convert date (string) to string (format needed by api) : "YYYY-MM-DD"
export function dateToString(date) {
    return date ? (new Date(date)).toISOString().slice(0, 10) : ''
}

//Convert datetime (string) to string (format needed by api) : "YYYY-MM-DD HH:MM:SS"
export function datetimeToString(date) {
    let dt = (new Date(date)).toISOString()
    return dt ? `${dt.slice(0, 10)} ${dt.slice(11, 19)}` : ''
}

//Check if major by birthdate (string) : boolean
export function isMajor(birthdate) {
    return Math.abs(new Date(Date.now() - (new Date(birthdate)).getTime()).getUTCFullYear() - 1970) >= 18
}

//Convert date (object) to be displayed in string : string
export function dateToCleanDateString(date) {
    return date instanceof Date && !isNaN(date) ?
        date
            .toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : ''
}
//Convert date (object) to be displayed in string : string
export function dateToCleanDateTimeString(date) {
    return date instanceof Date && !isNaN(date)  ?
        date
            .toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .replace('À', 'à')
        : ''
}

//Get year from date (string) : number
export function getYear(str) {
    return str ? (new Date(str).getFullYear()) : 0
}

//Get age from date (string) : number
export function getAge(str) {
    return str ? Math.abs(new Date(Date.now() - (new Date(str)).getTime()).getUTCFullYear() - 1970) : 0
}