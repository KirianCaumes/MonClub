import React from 'react'
import { MessageBarType, Pivot, PivotItem, PrimaryButton, DefaultButton, Icon, Separator, Text, Checkbox } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setModal } from 'redux/actions/common'
import request from 'helper/request'
import Workflow from 'component/workflow'
import Loader from 'component/loader'
import MembersMeInformations from './me/1-1_informations'
import MembersMeAutorizations from './me/1-2_autorizations'
import MembersMeDocuments from './me/2_documents'
import MembersMePayment from './me/4_payment'
import { setMembers, editMember } from 'redux/actions/member'
import MembersMeSummary from './me/3_summary'
import MembersMeFinalisation from './me/5_finalisation'

class _MembersMe extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            readOnly: false,
            errorField: {},
            page: 1,
            currentPivot: 0,
            prevMembers: [],
            prevMembersSelected: []
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
                text: 'Ajouter',
                iconProps: { iconName: 'AddFriend' },
                onClick: () => {
                    this.setState({ isLoading: true }, () => {
                        this.props.setMessageBar(false)
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
                text: 'Supprimer',
                iconProps: { iconName: 'UserRemove' },
                onClick: () => {
                    this.props.setModal(
                        true,
                        'Supprimer le membre',
                        'Êtes-vous certains de vouloir supprimer le membre ? Cette action est définitive.',
                        () => {
                            // this.props.setCommand([])
                            let id = this.props.members?.[this.state.currentPivot]?.id
                            if (id) { //If current pivot member has id
                                this.setState({ isLoading: true }, () => {
                                    request.deleteMember(id) //Delete on api
                                        .then(() => {
                                            let members = [...this.props.members]
                                            const index = members.findIndex(x => x.id === id)
                                            if (index > -1) members.splice(index, 1)
                                            this.props.setMembers(members)
                                            if (members.length === 0) { //If no more member, get one empty
                                                this.setState({ isLoading: true },
                                                    () => request.getNewMember()
                                                        .then(res => this.setState({ currentPivot: 0, errorField: [], page: 1 }, () => this.props.setMembers([res])))
                                                        .catch(err => this.setState({ errorField: err?.form?.children }, () => this.props.setMessageBar(true, MessageBarType.error, err)))
                                                        .finally(() => this.setState({ isLoading: false }))
                                                )
                                            } else {
                                                this.setState({ isLoading: false, page: 1, currentPivot: 0 })
                                            }
                                            this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été supprimé')
                                        })
                                        .catch(err => {
                                            this.setState({ isLoading: false, page: 1, currentPivot: 0 })
                                            this.setState({ errorField: err?.form?.children })
                                            this.props.setMessageBar(true, MessageBarType.error, err)
                                        })
                                })
                            } else { 
                                //Delete client only
                                let members = [...this.props.members] 
                                members.splice(this.state.currentPivot, 1)
                                this.props.setMembers(members)
                                if (members.length === 0) { //If no more member, get one empty
                                    this.setState({ isLoading: true },
                                        () => request.getNewMember()
                                            .then(res => this.setState({ currentPivot: 0, errorField: [], page: 1 }, () => this.props.setMembers([res])))
                                            .catch(err => this.setState({ errorField: err?.form?.children }, () => this.props.setMessageBar(true, MessageBarType.error, err)))
                                            .finally(() => this.setState({ isLoading: false }))
                                    )
                                }
                                this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été supprimé')
                                this.setState({ currentPivot: 0 })
                            }
                        }
                    )
                },
                disabled: this.props.data?.[this.state.currentPivot]?.is_payed
            },
            {
                key: 'getPrevious',
                text: 'Récupérer',
                iconProps: { iconName: 'UserSync' },
                onClick: () => this.showModalPrevMembers(),
                disabled: true
            },
        ]

        this.props.setCommand(this.commandRead)

        //Check if none member to find member from previous year
        request.getMePreviousMember()
            .then(res => {
                this.props.setMessageBar(false)
                this.setState({ prevMembers: res, prevMembersSelected: res },
                    () => {
                        if (!this.props.data?.map(x => x.id).filter(x => x).length && res.length) this.showModalPrevMembers()
                    }
                )
            })
            // .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.currentPivot !== this.state.currentPivot ||
            prevProps.members.length !== this.props.members.length ||
            prevState.prevMembers.length !== this.state.prevMembers.length ||
            JSON.stringify(prevProps.members) !== JSON.stringify(this.props.members)
        ) {
            this.props.setCommand([])
            //Check if member can be deleted
            if (prevState.currentPivot !== this.state.currentPivot) {
                this.commandRead[1].disabled = this.props.members?.[this.state.currentPivot]?.is_payed
            }
            //Check if need to disable new member
            if (prevProps.members.length !== this.props.members.length) {
                this.commandRead[0].disabled = this.props.members?.length >= 4
                this.commandRead[1].disabled = this.props.members?.[this.state.currentPivot]?.is_payed
            }

            if (prevState.prevMembers.length !== this.state.prevMembers.length || JSON.stringify(prevProps.members) !== JSON.stringify(this.props.members)) {
                this.commandRead[2].disabled = !!this.props.members?.map(x => x.id).filter(x => x).length || !this.state.prevMembers?.length
            }

            this.props.setCommand(this.commandRead)
            window.dispatchEvent(new Event('resize')) //Workaround to force commandbar to update
        }
    }

    showModalPrevMembers() {
        this.props.setModal(
            true,
            'Récupérer vos membres de la saison précédente',
            'Les membres suivants ont été trouvés pour la saison précédente. Voulez-vous les importer pour la nouvelle saison ?',
            () => this.setState({ isLoading: true },
                () => {
                    if (this.state.prevMembersSelected.length) this.props.setMembers(this.state.prevMembersSelected)
                    this.setState({ isLoading: false })
                }
            ),
            <>
                {this.state.prevMembers?.map((member, i) =>
                    <div key={i} className="is-capitalized" style={{ marginBottom: '5px' }}>
                        <Checkbox
                            label={member.firstname + " " + member.lastname}
                            defaultChecked={true}
                            onChange={(ev, isChecked) => {
                                if (isChecked) {
                                    this.setState({ prevMembersSelected: [...this.state.prevMembersSelected].concat(member) })
                                } else {
                                    let prevMembersSelected = [...this.state.prevMembersSelected]
                                    const index = prevMembersSelected.findIndex(x => JSON.stringify(x) === JSON.stringify(member))
                                    if (index > -1) prevMembersSelected.splice(index, 1)
                                    this.setState({ prevMembersSelected })
                                }
                            }}
                        />
                    </div>
                )}
            </>
        )
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
                    <Text variant="large" block className="has-text-centered"><b>Inscription saison {param?.season?.find(x => x.is_current)?.label}</b></Text>
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
                </div>
                <br />
                {isLoading ? <Loader /> :
                    <>
                        {/* <Text variant="large" block><Icon iconName='AccountManagement' /> Mes membres créés</Text>
                            <Divider /> */}
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
                                                                <div className="card">
                                                                    <MembersMeAutorizations
                                                                        readOnly={(member.is_payed && member.is_document_complete) || readOnly}
                                                                        errorField={errorField}
                                                                        memberIndex={i}
                                                                    />
                                                                    <Separator />
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
                                                                                        this.props.setMessageBar(false)
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
                                                                </div>
                                                            </>
                                                        )
                                                    case 2:
                                                        return (
                                                            <>
                                                                <div className="card">
                                                                    <MembersMeDocuments
                                                                        readOnly={(member.is_payed && member.is_document_complete) || readOnly}
                                                                        memberIndex={i}
                                                                        errorField={errorField}
                                                                    />
                                                                    <Separator />
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
                                                                                        this.props.setMessageBar(false)
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
                                                                </div>
                                                            </>
                                                        )
                                                    case 3:
                                                        return (
                                                            <>
                                                                <div className="card">
                                                                    <MembersMeSummary
                                                                        readOnly={(member.is_payed && member.is_document_complete) || readOnly}
                                                                        memberIndex={i}
                                                                    />
                                                                    <Separator />
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
                                                        <div className="card">
                                                            <MembersMeFinalisation />
                                                            <Separator />
                                                            <br />
                                                            <div className="flex-row flex-space-between flex-wrap">
                                                                <DefaultButton
                                                                    text="Retour"
                                                                    iconProps={{ iconName: 'Previous' }}
                                                                    onClick={() => this.setState({ page: 1 })}
                                                                />
                                                                <div />
                                                            </div>
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
        setModal: (show, title, subTitle, callback, content) => dispatch(setModal(show, title, subTitle, callback, content)),
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
