import React from 'react'
import { Label, Text, MessageBarType, Icon } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { Columns } from 'react-bulma-components'
import FileInput from 'component/fileInput'
import request from 'helper/request'
import { dlBlob, openBlob } from 'helper/blob'
import { editMember } from 'redux/actions/member'
import Divider from 'component/divider'

class _MembersMeDocumentsToDownload extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            errorDocument: {}
        }
    }

    componentWillUnmount() {
        if (this.fetchGetAttestation) this.fetchGetAttestation.cancel()
        if (this.fetchGetAttestation1) this.fetchGetAttestation1.cancel()
    }


    render() {
        const { memberIndex, param } = this.props
        const member = this.props.members[memberIndex]

        return (
            <section id="members-me-documents-download">
                <Text variant="large" block><Icon iconName='FabricUserFolder' /> Les documents téléchargeable</Text>
                <Divider />
                <Columns>
                    <Columns.Column>
                        <Label>Attestation paiement cotisation</Label>
                        <FileInput
                            isRead={true}
                            isFile={true}
                            isDisabled={!member.is_payed || !member.is_inscription_done}
                            tooltipContent={!member.is_payed || !member.is_inscription_done ? "Document téléchargeable une fois l'inscription finalisée et validée par le club." : ''}
                            onDownload={() => {
                                this.fetchGetAttestation = request.getAttestation(member?.id)
                                return this.fetchGetAttestation
                                    .fetch()
                                    .then(file => dlBlob(file, `${member?.firstname?.charAt(0).toUpperCase()}${member?.firstname?.slice(1)}_${member?.lastname.toUpperCase()}_${param?.season?.find(x => x.is_current)?.label}.pdf`))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}
                            onOpen={() => {
                                this.fetchGetAttestation = request.getAttestation(member?.id)
                                return this.fetchGetAttestation
                                    .fetch()
                                    .then(file => openBlob(file, `${member?.firstname?.charAt(0).toUpperCase()}${member?.firstname?.slice(1)}_${member?.lastname.toUpperCase()}_${param?.season?.find(x => x.is_current)?.label}.pdf`))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}
                        />
                    </Columns.Column>
                    <Columns.Column className="is-hidden-touch" />
                    <Columns.Column className="is-hidden-touch" />
                    <Columns.Column className="is-hidden-touch" />
                </Columns>
            </section >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: member => dispatch(setBreadcrumb(member)),
        setCommand: member => dispatch(setCommand(member)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
        editMember: (member, index) => dispatch(editMember(member, index))
    }
}

const mapStateToProps = state => {
    return {
        members: state.member.members,
        param: state.user.param
    }
}
const MembersMeDocumentsToDownload = connect(mapStateToProps, mapDispatchToProps)(_MembersMeDocumentsToDownload)
export default MembersMeDocumentsToDownload
