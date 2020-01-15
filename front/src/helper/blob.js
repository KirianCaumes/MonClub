export function dlBlob(file, fileName) {
    let a = document.createElement('a')
    a.href = window.URL.createObjectURL(file)
    a.download = fileName
    if (document.querySelector('.ms-Dialog-actionsRight')) { //Workaround to dl from a modal
        document.querySelector('.ms-Dialog-actionsRight').appendChild(a)
    } else {
        document.body.appendChild(a)
    }
    a.click()
    a.remove()
}

export function openBlob(file, fileName) {
    window.open(window.URL.createObjectURL(file), '_blank')
}