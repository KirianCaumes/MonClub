import React from 'react'
import { MessageBarType, Text, Pivot, PivotItem, PrimaryButton, DefaultButton, Icon } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setModal } from 'redux/actions/common'
import request from 'helper/request'
import Workflow from 'component/workflow'
import Loader from 'component/loader'
import MembersMeInformations from './me/informations'
import MembersMeAutorizations from './me/autorizations'
import MembersMeDocuments from './me/documents'
import MembersMePayment from './me/payment'
import { setMembers, editMember } from 'redux/actions/member'
import MembersMeSummary from './me/summary'
import MembersMeFinalisation from './me/finalisation'
import Divider from 'component/divider'
class _MembersMe extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            readOnly: false,
            errorField: {},
            page: 1,
            currentPivot: 0
        }

        this.props.setMembers(props.data)
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Membres', key: 'members' },
            { text: 'Mes membres', key: 'me-members', isCurrentItem: true },
        ])

        this.commandRead = [
            {
                key: 'addItem',
                text: 'Ajouter un membre',
                iconProps: { iconName: 'AddFriend' },
                onClick: () => {
                    this.setState({ isLoading: true }, () => {
                        request.getNewMember()
                            .then(res => {
                                let members = [...this.props.members]
                                members.push(res?.member)
                                this.props.setMembers(members)
                                this.setState({ currentPivot: members.length - 1, errorField: [], page: 1 })
                            })
                            .catch(err => {
                                this.setState({ errorField: err?.form?.children })
                                this.props.setMessageBar(true, MessageBarType.error, err)
                            })
                            .finally(() => {
                                this.setState({ isLoading: false })
                            })
                    })
                },
                disabled: this.props.data?.length >= 4
            },
            {
                key: 'deleteItem',
                text: 'Supprimer le membre',
                iconProps: { iconName: 'AddFriend' },
                onClick: () => {
                    this.props.setModal(
                        true,
                        'Supprimer le membre',
                        'Êtes-vous certains de vouloir supprimer le membre ? Cette action est définitive.',
                        () => {
                            this.props.setCommand([])
                            let id = this.props.members?.[this.state.currentPivot]?.id
                            if (id) {
                                this.setState({ isLoading: true }, () => {
                                    request.deleteMember(id)
                                        .then(() => {
                                            let members = [...this.props.members]
                                            const index = members.findIndex(x => x.id === id)
                                            if (index > -1) members.splice(index, 1)
                                            this.props.setMembers(members)
                                            this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été supprimé')
                                        })
                                        .catch(err => {
                                            this.setState({ errorField: err?.form?.children })
                                            this.props.setMessageBar(true, MessageBarType.error, err)
                                        })
                                        .finally(() => {
                                            this.setState({ isLoading: false, page: 1, currentPivot: 0 })
                                        })
                                })
                            } else {
                                let members = [...this.props.members]
                                members.splice(this.state.currentPivot, 1)
                                this.props.setMembers(members)
                                this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été supprimé')
                                this.setState({ currentPivot: 0 })
                            }
                        }
                    )
                },
                disabled: this.props.data?.[this.state.currentPivot]?.is_payed || this.props.data?.length === 1
            }
        ]

        this.props.setCommand(this.commandRead)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPivot !== this.state.currentPivot || prevProps.members.length !== this.props.members.length) {
            this.props.setCommand([])
            //Check if member can be deleted
            if (prevState.currentPivot !== this.state.currentPivot) {
                this.commandRead[1].disabled = this.props.members?.[this.state.currentPivot]?.is_payed || this.props.members?.length === 1
            }
            //Check if need to disable new member
            if (prevProps.members.length !== this.props.members.length) {
                this.commandRead[0].disabled = this.props.members?.length >= 4
                this.commandRead[1].disabled = this.props.members?.[this.state.currentPivot]?.is_payed || this.props.members?.length === 1
            }
            this.props.setCommand(this.commandRead)
        }
    }

    render() {
        const { isLoading, readOnly, page, currentPivot, errorField } = this.state
        const { members, param } = this.props

        return (
            <section id="members-me">
                <div className="card" >
                    <div className="head">
                        <h1><Icon iconName='AccountManagement' /> Inscription saison {param?.season?.find(x => x.is_current)?.label}</h1>
                    </div>
                    <br />
                    <Workflow
                        className="is-hidden-mobile"
                        data={[
                            {
                                label: "Informations",
                                description: "",
                                isCompleted: page >= 2 || !this.props.members?.map(x => x.is_payed)?.filter(x => !x)?.length,
                                isActive: page === 1,
                                isError: false
                            },
                            {
                                label: "Document(s)",
                                description: "",
                                isCompleted: page >= 3 || !this.props.members?.map(x => x.is_payed)?.filter(x => !x)?.length,
                                isActive: page === 2,
                                isError: false
                            },
                            {
                                label: "Récapitulatif",
                                description: "",
                                isCompleted: page >= 4 || !this.props.members?.map(x => x.is_payed)?.filter(x => !x)?.length,
                                isActive: page === 3,
                                isError: false
                            },
                            {
                                label: "Paiement",
                                description: "",
                                isCompleted: page >= 5 || !this.props.members?.map(x => x.is_payed)?.filter(x => !x)?.length,
                                isActive: page === 4,
                                isError: false
                            },
                            {
                                label: "Finalisation",
                                description: "",
                                isCompleted: page >= 6 || !this.props.members?.map(x => x.is_inscription_done)?.filter(x => !x)?.length,
                                isActive: page === 5,
                                isError: false
                            }
                        ]}
                    />
                    {isLoading ? <Loader /> :
                        <>
                            <Text variant="large" block><Icon iconName='AccountManagement' /> Mes membres créés</Text>
                            <Divider />
                            {
                                page <= 3
                                    ?
                                    <Pivot
                                        onLinkClick={(item) => {
                                            this.setState({ page: 1, currentPivot: parseInt(item.props.itemKey), errorField: {} })
                                        }}
                                        selectedKey={currentPivot?.toString()}
                                    >
                                        {members.map((member, i) => (
                                            <PivotItem
                                                key={i}
                                                itemKey={i.toString()}
                                                headerText={(() => {
                                                    if (window.innerWidth > 768) {
                                                        return `${(member?.firstname && member?.lastname) ? ((member?.firstname ?? '') + ' ' + (member?.lastname ?? '')) : 'Nouveau'}`
                                                    } else {
                                                        return undefined
                                                    }
                                                })()}
                                                itemIcon="Contact"
                                                data-content={null}
                                            >
                                                <br />
                                                {(() => {
                                                    switch (page) {
                                                        case 1:
                                                            return (
                                                                <>
                                                                    <MembersMeInformations
                                                                        readOnly={(member.is_payed && member.is_document_complete) || readOnly}
                                                                        errorField={errorField}
                                                                        memberIndex={i}
                                                                    />
                                                                    <br />
                                                                    <MembersMeAutorizations
                                                                        readOnly={(member.is_payed && member.is_document_complete) || readOnly}
                                                                        errorField={errorField}
                                                                        memberIndex={i}
                                                                    />
                                                                    <Divider />
                                                                    <br />
                                                                    <div className="flex-row flex-space-between flex-wrap">
                                                                        <div />
                                                                        <PrimaryButton
                                                                            text="Documents"
                                                                            iconProps={{ iconName: 'Next' }}
                                                                            styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                                            onClick={() => {
                                                                                if ((!member.is_payed || !member.is_document_complete) && !readOnly) {
                                                                                    this.setState({ isLoading: true }, () => {
                                                                                        request.editOrCreateMember(member?.id, { ...member })
                                                                                            .then(res => {
                                                                                                this.props.editMember(res, i)
                                                                                                this.setState({ errorField: {}, page: this.state.page + 1 })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                this.setState({ errorField: err?.form?.children })
                                                                                                this.props.setMessageBar(true, MessageBarType.error, err)
                                                                                            })
                                                                                            .finally(() => {
                                                                                                this.setState({ isLoading: false })
                                                                                            })
                                                                                    })
                                                                                } else {
                                                                                    this.setState({ errorField: {}, page: this.state.page + 1 })
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )
                                                        case 2:
                                                            return (
                                                                <>
                                                                    <MembersMeDocuments
                                                                        readOnly={(member.is_payed && member.is_document_complete) || readOnly}
                                                                        memberIndex={i}
                                                                        errorField={errorField}
                                                                    />
                                                                    <Divider />
                                                                    <br />
                                                                    <div className="flex-row flex-space-between flex-wrap">
                                                                        <DefaultButton
                                                                            text="Informations"
                                                                            iconProps={{ iconName: 'Previous' }}
                                                                            onClick={() => this.setState({ page: this.state.page - 1 })}
                                                                        />
                                                                        <PrimaryButton
                                                                            text="Récapitulatif"
                                                                            iconProps={{ iconName: 'Next' }}
                                                                            styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                                            onClick={() => {
                                                                                if ((!member.is_payed || !member.is_document_complete) && !readOnly) {
                                                                                    this.setState({ isLoading: true }, () => {
                                                                                        request.validateMemberDocument(member?.id)
                                                                                            .then(res => {
                                                                                                this.props.editMember(res, i)
                                                                                                this.setState({ errorField: {}, page: this.state.page + 1 })
                                                                                            })
                                                                                            .catch(err => {
                                                                                                this.setState({ errorField: err?.form?.children })
                                                                                                this.props.setMessageBar(true, MessageBarType.error, err)
                                                                                            })
                                                                                            .finally(() => {
                                                                                                this.setState({ isLoading: false })
                                                                                            })
                                                                                    })
                                                                                } else {
                                                                                    this.setState({ errorField: {}, page: this.state.page + 1 })
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )
                                                        case 3:
                                                            return (
                                                                <>
                                                                    <MembersMeSummary
                                                                        readOnly={(member.is_payed && member.is_document_complete) || readOnly}
                                                                        memberIndex={i}
                                                                    />
                                                                    <Divider />
                                                                    <br />
                                                                    <div className="flex-row flex-space-between flex-wrap">
                                                                        <DefaultButton
                                                                            text="Documents"
                                                                            iconProps={{ iconName: 'Previous' }}
                                                                            onClick={() => this.setState({ page: this.state.page - 1 })}
                                                                        />
                                                                        <PrimaryButton
                                                                            text="Paiement"
                                                                            iconProps={{ iconName: 'Next' }}
                                                                            styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                                            onClick={() => this.setState({ errorField: {}, page: this.state.page + 1 })}
                                                                            disabled={!members?.map(x => x.is_payed)?.filter(x => !x)?.length}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )
                                                        default:
                                                            return (null)
                                                    }
                                                })()}
                                            </PivotItem>
                                        ))}
                                    </Pivot>
                                    :
                                    <>
                                        {(() => {
                                            switch (page) {
                                                case 4:
                                                    return (
                                                        <>
                                                            <MembersMePayment
                                                                readOnly={readOnly}
                                                                goNext={() => this.setState({ page: this.state.page + 1 })}
                                                                goBack={() => this.setState({ page: 1 })}
                                                            />
                                                        </>
                                                    )
                                                case 5:
                                                    return (
                                                        <>
                                                            <MembersMeFinalisation />
                                                            <Divider />
                                                            <br />
                                                            <div className="flex-row flex-space-between flex-wrap">
                                                                <DefaultButton
                                                                    text="Retour"
                                                                    iconProps={{ iconName: 'Previous' }}
                                                                    onClick={() => this.setState({ page: 1 })}
                                                                />
                                                                <div />
                                                            </div>
                                                        </>
                                                    )
                                                default:
                                                    return (null)
                                            }
                                        })()}
                                    </>
                            }
                        </>
                    }
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
        setMembers: members => dispatch(setMembers(members)),
        editMember: (member, index) => dispatch(editMember(member, index)),
        setModal: (show, title, subTitle, callback) => dispatch(setModal(show, title, subTitle, callback)),
    }
}

const mapStateToProps = state => {
    return {
        members: state.member.members,
        param: state.user.param
    }
}
const MembersMe = connect(mapStateToProps, mapDispatchToProps)(_MembersMe)
export default MembersMe
