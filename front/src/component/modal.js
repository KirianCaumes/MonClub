import React from 'react'
import { Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType } from 'office-ui-fabric-react'
import { setModal } from 'redux/actions/common'
import { connect } from 'react-redux'

class _Modal extends React.PureComponent {
    componentDidUpdate(prevProps) {
        if (prevProps.modal?.show !== this.props.modal?.show && this.props.modal?.show === true) {
            setTimeout(() => document.querySelector('.ms-Modal-scrollableContent').scrollTop = 0, 50)
        }
    }

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
                    dragOptions: false
                }}
                maxWidth={"555px"}
            >
                {modal.content}
                <DialogFooter>
                    <DefaultButton
                        onClick={() => setModal(false, modal.title, modal.subTitle, modal.callback, modal.content)}
                        text="Annuler"
                    />
                    {modal.callback && typeof modal.callback === "function" &&
                        <PrimaryButton
                            onClick={() => {
                                modal.callback()
                                setModal(false, modal.title, modal.subTitle, modal.callback, modal.content)
                            }}
                            text="Oui"
                        />
                    }
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
