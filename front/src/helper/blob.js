export function dlBlob(file, fileName) {
    let a = document.createElement('a')
    a.href = window.URL.createObjectURL(file)
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
}

export function openBlob(file, fileName) {
    window.open(window.URL.createObjectURL(file), '_blank')
}