import React from 'react'
import { Separator, DefaultButton, Label, Text, PrimaryButton, MessageBarType } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../../redux/actions/common'
import Loader from '../../../component/loader'
import { Columns } from 'react-bulma-components'
import FileInput from '../../../component/fileInput'
import request from '../../../helper/request'
import { dlBlob } from '../../../helper/dlBlob'

class _MembersMeDocuments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            readOnly: false,
            member: { ...props?.member ?? {} },
            errorField: {}
        }

        this.choice = [
            { key: 'true', text: 'Oui' },
            { key: 'false', text: 'Non' },
        ]
    }

    render() {
        const { isLoading, readOnly } = this.state  
        const { memberIndex } = this.props
        const member = this.props.members[memberIndex]
        console.log(member)

        if (isLoading) return <Loader />

        return (
            <section id="members-me-autorizations">
                <Text variant="large" block>Les documents</Text>
                <Separator />
                <Columns>
                    <Columns.Column>
                        <Label required>Certificat médical</Label>
                        <FileInput
                            read={readOnly}
                            errorMessage={this.state.errorField?.documentFile1?.errors?.[0]}
                            isFile={member?.documents?.find(doc => doc?.category?.id === 1)?.document}
                            fileName={member?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name}
                            onDownload={() => {
                                return request.getDocument(member.id, 1)
                                    .then(file => dlBlob(file, member?.documents?.find(doc => doc?.category?.id === 1)?.document?.original_name))
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                            }}
                            onUpload={file => {
                                return request.uploadDocument(file, member.id, 1)
                                    .then(doc => {
                                        let documents = [...member.documents]
                                        documents.push(doc)
                                        // this.setState({ member: { ...this.state.member, documents: documents } }) //TODO
                                    })
                                    .catch(err => {
                                        this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                        this.setState({ errorField: { ...this.state.errorField, documentFile1: err?.form?.children?.documentFile } }, () => setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50))
                                    })
                            }}
                            onDelete={() => {
                                return request.deleteDocument(member.id, 1)
                                    .then(() => {
                                        let documents = [...member.documents]
                                        const currIndex = documents?.findIndex(doc => doc?.category?.id === 1)
                                        if (currIndex > -1) documents.splice(currIndex, 1)
                                        // this.setState({ member: { ...this.state.member, documents: documents } })
                                    })
                                    .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                            }}
                        />
                    </Columns.Column>

                    <Columns.Column>
                        {
                            member?.is_reduced_price &&
                            <>
                                <Label required>Jusitificatif étudiant/chomage</Label>
                                <FileInput
                                    read={readOnly}
                                    errorMessage={this.state.errorField?.documentFile2?.errors?.[0]}
                                    isFile={member?.documents?.find(doc => doc?.category?.id === 2)?.document}
                                    fileName={member?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name}
                                    onDownload={() => {
                                        return request.getDocument(member.id, 2)
                                            .then(file => dlBlob(file, member?.documents?.find(doc => doc?.category?.id === 2)?.document?.original_name))
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                                    }}
                                    onUpload={file => {
                                        return request.uploadDocument(file, member.id, 2)
                                            .then(doc => {
                                                let documents = [...member.documents]
                                                documents.push(doc)
                                                // this.setState({ member: { ...this.state.member, documents: documents } })
                                            })
                                            .catch(err => {
                                                this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                                this.setState({ errorField: { ...this.state.errorField, documentFile2: err?.form?.children?.documentFile } }, () => setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50))
                                            })
                                    }}
                                    onDelete={() => {
                                        return request.deleteDocument(member.id, 2)
                                            .then(() => {
                                                let documents = [...member.documents]
                                                const currIndex = documents?.findIndex(doc => doc?.category?.id === 2)
                                                if (currIndex > -1) documents.splice(currIndex, 1)
                                                // this.setState({ member: { ...this.state.member, documents: documents } })
                                            })
                                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                                    }}
                                />
                            </>
                        }
                    </Columns.Column>
                    <Columns.Column />
                </Columns>
                <br />
                <div className="flex-row flex-space-between">
                    <DefaultButton
                        text="Retour"
                        iconProps={{ iconName: 'Previous' }}
                        onClick={() => this.props.goBack()}
                    />
                    <PrimaryButton
                        text="Paiement"
                        iconProps={{ iconName: 'Next' }}
                        styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                        onClick={() => this.props.goNext()}
                    />
                </div>
            </section >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: member => dispatch(setBreadcrumb(member)),
        setCommand: member => dispatch(setCommand(member)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
    }
}

const mapStateToProps = state => {
    return {
        members: state.member.members
    }
}
const MembersMeDocuments = connect(mapStateToProps, mapDispatchToProps)(_MembersMeDocuments)
export default MembersMeDocuments
