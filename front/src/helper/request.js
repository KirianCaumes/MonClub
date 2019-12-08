import store from '../redux/store/index.js'
import { setMessageBar } from '../redux/actions/common.js'
import { signout } from '../redux/actions/user.js'
import { MessageBarType } from 'office-ui-fabric-react';


const
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"

var getFetch = (url, options = {}) => {
    const baseUrl = "/api"

    options["mode"] = "cors"


    if (options["headers"] === undefined)
        options["headers"] = {}

    options["headers"]["Accept"] = 'application/json'
    if (options["headers"]["Content-Type"] === "multipart/form-data") {
        delete options["headers"]["Content-Type"]
    } else {
        options["headers"]["Content-Type"] = 'application/json'
    }

    if (localStorage.getItem(process.env.REACT_APP_LOCAL_STORAGE_KEY)) options["headers"]["Authorization"] = "Bearer " + localStorage.getItem(process.env.REACT_APP_LOCAL_STORAGE_KEY)

    return fetch(baseUrl + "/" + url.join("/"), options)
        .then(async (response) => {
            if (!response.ok) {
                var is403 = false
                // Handle status code error
                switch (response.status) {
                    case 403:
                        is403 = true
                        store.dispatch(setMessageBar(true, MessageBarType.error, "Vous n'êtes pas autorisé à effectuer cette action"))
                        break
                    case 401:
                        store.dispatch(signout())
                        break
                    default:
                        break
                }
                // Throw error for other behaviours after there default action
                throw await response.text().then(x => {
                    if (is403) return "Vous n'êtes pas autoriser à effectuer cette action"
                    if (!!x.length)
                        return JSON.parse(x)
                    return x
                })
            } else {
                return checkBodyOfResponse(response)
            }
        })
}

var checkBodyOfResponse = (response) => {
    // Get response on text format
    let clone = response.clone() //Used to create a Blob file for download file
    let resText = response.text()

    // Check if body is already available
    // and return it parse on JSON
    if (!!resText.length) {
        return JSON.parse(resText)
    } else {
        // Check if response is an Promise
        if (resText instanceof Promise) {
            // Get response of promise
            return resText.then(res => {
                // Return body parse on JSON if exist
                if (!!res.length) {
                    // return JSON.parse(res)
                    try {
                        JSON.parse(res)
                    } catch (e) {
                        return clone.blob()
                    }
                    return JSON.parse(res)
                } else {
                    return res
                }
            })
        }
        return resText
    }
}

export default {
    getMe: () => {
        const url = ["me"]
        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getParam: () => {
        const url = ["param"]
        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    authenticate: (data) => {
        const url = ["login"]
        var options = {
            method: POST,
            body: JSON.stringify(data)
        }

        return getFetch(url, options)
    },
    register: (data) => {
        const url = ["register"]
        var options = {
            method: POST,
            body: JSON.stringify(data)
        }

        return getFetch(url, options)
    },
    resetMail: (data) => {
        const url = ["reset", "mail"]
        var options = {
            method: POST,
            body: JSON.stringify(data)
        }

        return getFetch(url, options)
    },
    reset: (data) => {
        const url = ["reset"]
        var options = {
            method: POST,
            body: JSON.stringify(data)
        }

        return getFetch(url, options)
    },
    getInfos: () => {
        const url = ["infos"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getContracts: () => {
        const url = ["movies"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
}