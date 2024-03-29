import {
    EDIT_MEMBER,
    SET_MEMBERS,
} from "redux/_action-types"

const initialState = {
    members: []
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case EDIT_MEMBER:
            let members = [...state.members]
            members[action.payload.index] = { ...members[action.payload.index], ...action.payload.member }
            return { ...state, members }
        case SET_MEMBERS:
            return { ...state, members: action.payload }
        default:
            break
    }
    return state
}