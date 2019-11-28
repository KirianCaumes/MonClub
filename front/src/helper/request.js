import { history } from './history';
import store from '../redux/store/index.js'
import { signout, setError } from '../redux/actions/index.js'


const
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"

var getFetch = (url, options = {}) => {
    const baseUrl = "http://localhost:5000/api"
          
    options["mode"] = "cors"


    if (options["headers"] === undefined)
        options["headers"] = {}

    options["headers"]["Accept"] = 'application/json'
    if (options["headers"]["Content-Type"] === "multipart/form-data") {
        delete options["headers"]["Content-Type"]
    } else {
        options["headers"]["Content-Type"] = 'application/json'
    }

    if (localStorage.getItem('CCMIAppToken')) options["headers"]["Authorization"] = "Bearer " + localStorage.getItem('CCMIAppToken')

    return fetch(baseUrl + "/" + url.join("/"), options)
        .then(async (response) => {
            if (!response.ok) {
                var is403 = false
                // Handle status code error
                switch (response.status) {
                    case 403:
                        is403 = true
                        store.dispatch(setError("Vous n'êtes pas autorisé à effectuer cette action"))
                        break
                    case 401:
                        store.dispatch(signout(() => {
                            localStorage.removeItem("CCMIAppToken")
                            history.push("/login")
                        }))
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
    authenticate: (data) => {
        const url = ["login"]
        var options = {
            method: POST,
            body: JSON.stringify(data)
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