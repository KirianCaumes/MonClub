import React from 'react'
import { Separator, Label, Text, MessageBarType } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../../redux/actions/common'
import { Columns } from 'react-bulma-components'
import FileInput from '../../../component/fileInput'
import request from '../../../helper/request'
import { dlBlob, openBlob } from '../../../helper/blob'
import { editMember } from '../../../redux/actions/member'

class _MembersMeDocuments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorDocument: {}
        }

        this.choice = [
            { key: 'true', text: 'Oui' },
            { key: 'false', text: 'Non' },
        ]
    }

    render() {
        const { memberIndex, readOnly, errorField, param } = this.props
        const { errorDocument } = this.state
        const member = this.props.members[memberIndex]

        return (
            <section id="members-me-documents">
                <Text variant="large" block>Les documents</Text>
                <Separator />
                <Columns>
                    <Columns.Column>
                        <Label required>Certificat médical</Label>
                        <FileInput
                            // read={false}
                            read={readOnly}
                            errorMessage={errorDocument?.documentFile1?.errors?.[0] || errorField?.['1']?.[0]}
                            isFile={!!member?.documents?.find(doc => doc?.category?.id === 1)?.document}
                            fileName={member?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name}
                            onDownload={() => {
                                return request.getDocument(member.id, 1)
                                    .then(file => dlBlob(file, member?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}                                 
                            onOpen={() => {
                                return request.getDocument(member.id, 1)
                                    .then(file => openBlob(file, member?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                            }}
                            onUpload={file => {
                                return request.uploadDocument(file, member.id, 1)
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
                                return request.deleteDocument(member.id, 1)
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
                                // read={false}
                                read={readOnly}
                                errorMessage={errorDocument?.documentFile2?.errors?.[0] || errorField?.['2']?.[0]}
                                isFile={!!member?.documents?.find(doc => doc?.category?.id === 2)?.document}
                                fileName={member?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name}
                                onDownload={() => {
                                    return request.getDocument(member.id, 2)
                                        .then(file => dlBlob(file, member?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                }}                                    
                                onOpen={() => {
                                    return request.getDocument(member.id, 2)
                                        .then(file => openBlob(file, member?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                }}
                                onUpload={file => {
                                    return request.uploadDocument(file, member.id, 2)
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
                                    return request.deleteDocument(member.id, 2)
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
                        {
                            member.is_payed &&
                            <>
                                <Label>Attestation paiement cotisation</Label>
                                <FileInput
                                    read={true}
                                    isFile={!!readOnly}
                                    onDownload={() => {
                                        return request.getAttestation(member?.id)
                                            .then(file => dlBlob(file, `${member?.firstname?.charAt(0).toUpperCase()}${member?.firstname?.slice(1)}_${member?.lastname.toUpperCase()}_${param?.season?.find(x => x.is_current)?.label}.pdf`))
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }}                                    
                                    onOpen={() => {
                                        return request.getAttestation(member?.id)
                                            .then(file => openBlob(file, `${member?.firstname?.charAt(0).toUpperCase()}${member?.firstname?.slice(1)}_${member?.lastname.toUpperCase()}_${param?.season?.find(x => x.is_current)?.label}.pdf`))
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }}
                                />
                            </>
                        }
                    </Columns.Column>
                    <Columns.Column />
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
const MembersMeDocuments = connect(mapStateToProps, mapDispatchToProps)(_MembersMeDocuments)
export default MembersMeDocuments
