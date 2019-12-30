import React from 'react'
import { MessageBarType, Text, MessageBar, Pivot, PivotItem, PrimaryButton } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import request from '../../helper/request'
import Workflow from '../../component/workflow'
import Loader from '../../component/loader'
import MembersMeInformations from './me/informations'
import MembersMeAutorizations from './me/autorizations'
import MembersMeDocuments from './me/documents'
import MembersMePayment from './me/payment'
import { setMembers, editMember } from '../../redux/actions/member'

class _MembersMe extends React.Component {
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

        const commandRead = [
            {
                key: 'addItem',
                text: 'Ajouter un membre',
                iconProps: { iconName: 'AddFriend' },
                onClick: () => {
                    request.getNewMember()
                        .then(res => {
                            let members = [...this.props.members]
                            members.push(res?.member)
                            this.props.setMembers(members)
                            this.setState({ currentPivot: members.length - 1, errorField: [] })
                            //Check if need to disable new member
                            if (members?.length >= 4) {
                                this.props.setCommand([])
                                commandRead[0].disabled = true
                                this.props.setCommand(commandRead)
                            }
                        })
                },
                disabled: this.props.members?.length >= 4
            }
        ]

        this.props.setCommand(commandRead)
    }

    render() {
        const { isLoading, readOnly, page, currentPivot, errorField } = this.state
        const { members } = this.props

        if (isLoading) return <Loader />

        return (
            <section id="members-me">
                <div className="card" >
                    <Text variant="xLarge" block className="has-text-centered is-uppercase">Inscription saison 2020–2021</Text>
                    <br />
                    <Workflow
                        className="is-hidden-mobile"
                        data={[
                            {
                                label: "Informations",
                                description: "",
                                isCompleted: page >= 2,
                                isActive: page === 1,
                                isError: false
                            },
                            {
                                label: "Document(s)",
                                description: "",
                                isCompleted: page >= 3,
                                isActive: page === 2,
                                isError: false
                            },
                            {
                                label: "Paiement",
                                description: "",
                                isCompleted: page >= 4,
                                isActive: page === 3,
                                isError: false
                            },
                            {
                                label: "Finalisation",
                                description: "",
                                isCompleted: page >= 5,
                                isActive: page === 4,
                                isError: false
                            }
                        ]}
                    />

                    <MessageBar messageBarType={MessageBarType.warning} isMultiline={false} >
                        Avant toute opérations sur MonClub, veuillez finaliser votre inscription Gest'Hand.
                    </MessageBar>
                    <br />
                    <Pivot
                        onLinkClick={(item) => {
                            this.setState({ page: 1, currentPivot: item.props.itemKey, errorField: {} })
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
                                {
                                    (() => {
                                        switch (page) {
                                            case 1:
                                                return (
                                                    <>
                                                        <MembersMeInformations
                                                            errorField={errorField}
                                                            memberIndex={i}
                                                        />
                                                        <br />
                                                        <MembersMeAutorizations
                                                            errorField={errorField}
                                                            memberIndex={i}
                                                        />
                                                        <br />
                                                        <div className="flex-row flex-space-between">
                                                            <div />
                                                            <PrimaryButton
                                                                text="Documents"
                                                                iconProps={{ iconName: 'Next' }}
                                                                styles={{ flexContainer: { flexDirection: 'row-reverse' } }}
                                                                onClick={() => {
                                                                    this.setState({ isLoading: true, readOnly: true }, () => {
                                                                        request.editOrCreateMember(member?.id, { ...member })
                                                                            .then(res => {
                                                                                this.props.editMember(res, i)
                                                                                this.setState({ errorField: {}, page: this.state.page + 1 })
                                                                            })
                                                                            .catch(err => {
                                                                                this.setState({ errorField: err?.form?.children })
                                                                                this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                                                            })
                                                                            .finally(() => {
                                                                                this.setState({ isLoading: false })
                                                                            })
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                )
                                            case 2:
                                                return (
                                                    <>
                                                        <MembersMeDocuments
                                                            memberIndex={i}
                                                            goBack={() => this.setState({ page: this.state.page - 1 })}
                                                            goNext={() => this.setState({ page: this.state.page + 1 })}
                                                        />
                                                    </>
                                                )
                                            case 3:
                                                return (
                                                    <>
                                                        <MembersMePayment
                                                            member={member}
                                                            goBack={() => this.setState({ page: this.state.page - 1 })}
                                                            goNext={() => this.setState({ page: this.state.page + 1 })}
                                                        />
                                                    </>
                                                )
                                            default:
                                                return (null)
                                        }
                                    })()
                                }
                            </PivotItem>
                        ))}


                    </Pivot>
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
        editMember: (member, index) => dispatch(editMember(member, index))
    }
}

const mapStateToProps = state => {
    return {
        members: state.member.members
    }
}
const MembersMe = connect(mapStateToProps, mapDispatchToProps)(_MembersMe)
export default MembersMe
