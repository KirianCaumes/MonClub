import React from 'react'
import { Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType } from 'office-ui-fabric-react'
import { setModal } from 'redux/actions/common'
import { connect } from 'react-redux'

class _Modal extends React.PureComponent {
    render() {
        const { modal, setModal } = this.props

        return (
            <Dialog
                hidden={!modal.show}
                onDismiss={() => setModal(false, modal.title, modal.subTitle, modal.callback, modal.content)}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: modal.title,
                    subText: modal.subTitle
                }}
                modalProps={{
                    isBlocking: true,
                    styles: { main: { maxWidth: 450 } },
                    dragOptions: false
                }}
            >
                {modal.content}
                <DialogFooter>
                    <DefaultButton
                        onClick={() => setModal(false, modal.title, modal.subTitle, modal.callback, modal.content)}
                        text="Annuler"
                    />
                    <PrimaryButton
                        onClick={() => {
                            modal.callback()
                            setModal(false, modal.title, modal.subTitle, modal.callback, modal.content)
                        }}
                        text="Oui"
                    />
                </DialogFooter>
            </Dialog>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setModal: (show, title, subTitle, callback, content) => dispatch(setModal(show, title, subTitle, callback, content)),
    }
}

const mapStateToProps = state => {
    return {
        modal: state.common.modal
    }
}
const Modal = connect(mapStateToProps, mapDispatchToProps)(_Modal)
export default Modal
