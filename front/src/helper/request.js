import store from '../redux/store/index.js'
import { setMessageBar } from '../redux/actions/common.js'
import { signout } from '../redux/actions/user.js'
import { MessageBarType } from 'office-ui-fabric-react';


const
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"

var getFetch = (path, options = {}) => {
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

    const url = new URL(origin + baseUrl + "/" + path.join("/"))
    if (options.params) Object.keys(options.params).forEach(key => url.searchParams.append(key, options.params[key]))

    return fetch(url, options)
        .then(async (response) => {
            if (!response.ok) {
                // Handle status code error
                switch (response.status) {
                    case 403:
                        store.dispatch(setMessageBar(true, MessageBarType.error, "Vous n'êtes pas autorisé à effectuer cette action"))
                        return "Vous n'êtes pas autoriser à effectuer cette action"
                    case 401:
                        store.dispatch(signout())
                        break
                    default:
                        break
                }
                // Throw error for other behaviours after there default action
                throw await response.text().then(x => {
                    if (!!x.length) return JSON.parse(x)
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
    getAllMembers: (params) => {
        const url = ["member"]

        var options = {
            method: GET,
            params
        }

        return getFetch(url, options)
    },
    getOneMember: (id) => {
        const url = ["member", id]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
}