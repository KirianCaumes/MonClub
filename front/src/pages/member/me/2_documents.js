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

class _MembersMeDocuments extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            errorDocument: {}
        }
    }

    componentWillUnmount() {
        if (this.fetchGetDocumentOne) this.fetchGetDocumentOne.cancel()
        if (this.fetchGetDocumentOne1) this.fetchGetDocumentOne1.cancel()
        if (this.fetchUploadDocumentOne) this.fetchUploadDocumentOne.cancel()
        if (this.fetchDeleteDocumentOne) this.fetchDeleteDocumentOne.cancel()
        if (this.fetchGetDocumentTwo) this.fetchGetDocumentTwo.cancel()
        if (this.fetchGetDocumentTwo1) this.fetchGetDocumentTwo1.cancel()
        if (this.fetchUploadDocumentTwo) this.fetchUploadDocumentTwo.cancel()
        if (this.fetchDeleteDocumentTwo) this.fetchDeleteDocumentTwo.cancel()
        if (this.fetchGetAttestation) this.fetchGetAttestation.cancel()
        if (this.fetchGetAttestation1) this.fetchGetAttestation1.cancel()
    }


    render() {
        const { memberIndex, readOnly, errorField, param } = this.props
        const { errorDocument } = this.state
        const member = this.props.members[memberIndex]

        return (
            <section id="members-me-documents">
                <Text variant="large" block><Icon iconName='FabricUserFolder' /> Les documents</Text>
                <Divider />
                <Columns>
                    <Columns.Column>
                        <Label required>Certificat médical</Label>
                        <FileInput
                            // isRead={false}
                            isRead={readOnly}
                            errorMessage={errorDocument?.documentFile1?.errors?.[0] || errorField?.['1']?.[0]}
                            isFile={!!member?.documents?.find(doc => doc?.category?.id === 1)?.document}
                            fileName={member?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name}
                            onDownload={() => {
                                this.fetchGetDocumentOne = request.getDocument(member.id, 1)
                                return this.fetchGetDocumentOne
                                    .fetch()
                                    .then(file => dlBlob(file, member?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}
                            onOpen={() => {
                                this.fetchGetDocumentOne1 = request.getDocument(member.id, 1)
                                return this.fetchGetDocumentOne1
                                    .fetch()
                                    .then(file => openBlob(file, member?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}
                            onUpload={file => {
                                this.fetchUploadDocumentOne = request.uploadDocument(file, member.id, 1)
                                return this.fetchUploadDocumentOne
                                    .fetch()
                                    .then(doc => {
                                        let documents = [...member.documents]
                                        documents.push(doc)
                                        this.props.editMember({ documents }, memberIndex)
                                        this.setState({ errorDocument: {} })
                                    })
                                    .catch(err => {
                                        this.props.setMessageBar(true, MessageBarType.error, err)
                                        this.setState({ errorDocument: { ...this.state.errorDocument, documentFile1: err?.form?.children?.documentFile } })
                                    })
                            }}
                            onDelete={() => {
                                this.fetchDeleteDocumentOne = request.deleteDocument(member.id, 1)
                                return this.fetchDeleteDocumentOne
                                    .fetch()
                                    .then(() => {
                                        let documents = [...member.documents]
                                        const currIndex = documents?.findIndex(doc => doc?.category?.id === 1)
                                        if (currIndex > -1) documents.splice(currIndex, 1)
                                        this.props.editMember({ documents }, memberIndex)
                                        this.setState({ errorDocument: {} })
                                    })
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}
                        />
                    </Columns.Column>
                    {
                        member?.is_reduced_price &&
                        <Columns.Column>
                            <Label required>Jusitificatif étudiant/chomage</Label>
                            <FileInput
                                // isRead={false}
                                isRead={readOnly}
                                errorMessage={errorDocument?.documentFile2?.errors?.[0] || errorField?.['2']?.[0]}
                                isFile={!!member?.documents?.find(doc => doc?.category?.id === 2)?.document}
                                fileName={member?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name}
                                onDownload={() => {
                                    this.fetchGetDocumentTwo = request.getDocument(member.id, 2)
                                    return this.fetchGetDocumentTwo
                                        .fetch()
                                        .then(file => dlBlob(file, member?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                }}
                                onOpen={() => {
                                    this.fetchGetDocumentTwo1 = request.getDocument(member.id, 2)
                                    return this.fetchGetDocumentTwo1
                                        .fetch()
                                        .then(file => openBlob(file, member?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                }}
                                onUpload={file => {
                                    this.fetchUploadDocumentTwo = request.uploadDocument(file, member.id, 2)
                                    return this.fetchUploadDocumentTwo
                                        .fetch()
                                        .then(doc => {
                                            let documents = [...member.documents]
                                            documents.push(doc)
                                            this.props.editMember({ documents }, memberIndex)
                                            this.setState({ errorDocument: {} })
                                        })
                                        .catch(err => {
                                            this.props.setMessageBar(true, MessageBarType.error, err)
                                            this.setState({ errorDocument: { ...this.state.errorDocument, documentFile2: err?.form?.children?.documentFile } })
                                        })
                                }}
                                onDelete={() => {
                                    this.fetchDeleteDocumentTwo = request.deleteDocument(member.id, 2)
                                    return this.fetchDeleteDocumentTwo
                                        .fetch()
                                        .then(() => {
                                            let documents = [...member.documents]
                                            const currIndex = documents?.findIndex(doc => doc?.category?.id === 2)
                                            if (currIndex > -1) documents.splice(currIndex, 1)
                                            this.props.editMember({ documents }, memberIndex)
                                            this.setState({ errorDocument: {} })
                                        })
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                }}
                            />
                        </Columns.Column>
                    }
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
                    {!member?.is_reduced_price && <Columns.Column className="is-hidden-touch" />}
                </Columns>
                <Text className="has-text-danger">Veillez à bien vous assurer de la validité des documents téléversés.</Text>
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
const MembersMeDocuments = connect(mapStateToProps, mapDispatchToProps)(_MembersMeDocuments)
export default MembersMeDocuments
