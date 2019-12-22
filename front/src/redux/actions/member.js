import {
    EDIT_MEMBER,
    SET_MEMBERS,
} from "../_action-types"

export function setMembers(members) {
    return { type: SET_MEMBERS, payload: members }
}

export function editMember(member, index) {
    return { type: EDIT_MEMBER, payload: { member, index } }
}