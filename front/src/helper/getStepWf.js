import store from "../redux/store";

//Function to get step label by user infos
export default function getWf (user) {
    let wfSteps = store.getState().user.param?.workflowStep

    console.log(store.getState().user.param?.workflowStep)

    if (user.is_inscription_done) {
        return wfSteps.find(x => x.id === 5)?.label
    } else if (user.is_check_gest_hand) {
        return wfSteps.find(x => x.id === 4)?.label
    } else if (user.is_payed) {
        return wfSteps.find(x => x.id === 3)?.label
    } else if (user.is_document_complete) {
        return wfSteps.find(x => x.id === 2)?.label
    } else {
        return wfSteps.find(x => x.id === 1)?.label
    }
}