import store from '../redux/store/index.js'
import { signout } from '../redux/actions/user.js'
import { dateToString } from './date.js';


const
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"

var getFetch = (path, options = {}) => {
    const baseUrl = "/api"

    options["mode"] = "cors"

    if (options["headers"] === undefined) options["headers"] = {}

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
        const url = ["user", "me"]
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
        const url = ["user", "infos"]

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
    getNewMember: () => {
        const url = ["member", "new"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getMeMember: () => {
        const url = ["member", "me"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    createMember: (body) => {
        const url = ["member"]
        body = {
            ...body,
            birthdate: dateToString(body?.birthdate)
        }

        var options = {
            method: POST,
            body: JSON.stringify(body)
        }

        return getFetch(url, options)
    },
    createMemberAdmin: (body) => {
        const url = ["member", "admin"]
        body = {
            ...body,
            birthdate: dateToString(body?.birthdate)
        }

        var options = {
            method: POST,
            body: JSON.stringify(body)
        }

        return getFetch(url, options)
    },
    editMember: (id, body) => {
        const url = ["member", id]
        body = {
            ...body,
            birthdate: dateToString(body?.birthdate)
        }

        var options = {
            method: PUT,
            body: JSON.stringify(body)
        }

        return getFetch(url, options)
    },
    editOrCreateMember: (id, body) => {
        body = {
            ...body,
            birthdate: dateToString(body?.birthdate)
        }
        let url = ["member"]

        let options = {
            body: JSON.stringify(body)
        }

        if (id) {
            url.push(id)
            options.method = PUT
        } else {
            options.method = POST
        }

        return getFetch(url, options)
    },
    editMemberAdmin: (id, body) => {
        const url = ["member", id, "admin"]
        body = {
            ...body,
            birthdate: dateToString(body?.birthdate),
            teams: body?.teams.map(x => x.id)
        }

        var options = {
            method: PUT,
            body: JSON.stringify(body)
        }

        return getFetch(url, options)
    },
    deleteMember: (id) => {
        const url = ["member", id]

        var options = {
            method: DELETE
        }

        return getFetch(url, options)
    },
    validateMemberDocument: (memberId) => {
        const url = ["member", memberId, "validate-document"]

        var options = {
            method: POST
        }

        return getFetch(url, options)
    },
    getMemberPrice: (memberId) => {
        const url = ["member", memberId, "price"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getMeMemberPrices: (memberId) => {
        const url = ["member", "me", "price"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getAllTeams: () => {
        const url = ["team"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getOneTeam: (id) => {
        const url = ["team", id]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getNewTeam: () => {
        const url = ["team", "new"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    createTeam: (body) => {
        const url = ["team"]

        var options = {
            method: POST,
            body: JSON.stringify(body)
        }

        return getFetch(url, options)
    },
    editTeam: (id, body) => {
        const url = ["team", id]

        var options = {
            method: PUT,
            body: JSON.stringify(body)
        }

        return getFetch(url, options)
    },
    deleteTeam: (id) => {
        const url = ["team", id]

        var options = {
            method: DELETE
        }

        return getFetch(url, options)
    },
    uploadDocument: (file, memberId, fileTypeId) => {
        const url = ["document", memberId, fileTypeId]
        let formData = new FormData()
        formData.append("documentFile", file)

        var options = {
            method: POST,
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formData
        }

        return getFetch(url, options)
    },
    getDocument: (memberId, fileTypeId) => {
        const url = ["document", memberId, fileTypeId]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getAttestation: (memberId) => {
        const url = ["document", memberId, "attestation"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    deleteDocument: (memberId, fileTypeId) => {
        const url = ["document", memberId, fileTypeId]

        var options = {
            method: DELETE
        }

        return getFetch(url, options)
    },
    getAllUsers: () => {
        const url = ["user"]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    getOneUser: (id) => {
        const url = ["user", id]

        var options = {
            method: GET
        }

        return getFetch(url, options)
    },
    editUser: (id, body) => {
        const url = ["user", id]

        var options = {
            method: PUT,
            body: JSON.stringify(body)
        }

        return getFetch(url, options)
    },
}