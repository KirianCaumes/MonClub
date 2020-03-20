import { ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_COACH } from "./constants"

//Function to get highest role from roles list
export default function getHighestRole (roles) {
    if (!Array.isArray(roles)) return null

    if (roles?.includes(ROLE_SUPER_ADMIN)) {
        return ROLE_SUPER_ADMIN
    } else if (roles?.includes(ROLE_ADMIN)) {
        return ROLE_ADMIN
    } else if (roles?.includes(ROLE_COACH)) {
        return ROLE_COACH
    } else {
        return null
    }
}