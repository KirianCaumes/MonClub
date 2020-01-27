import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, DetailsList, SelectionMode, MessageBarType, Text, Icon } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setModal } from 'redux/actions/common'
import { history } from 'helper/history'
import request from 'helper/request'
import Loader from 'component/loader'
import Divider from 'component/divider'

class _TeamOne extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            readOnly: !!this.props.match?.params?.id,
            isLoading: false,
            data: { ...props?.data ?? {} },
            initData: { ...props?.data ?? {} },
            errorField: {}
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Équipe', key: 'teams' },
            { text: 'Toutes les équipes', key: 'all-teams', onClick: () => history.push('/equipes') },
            { text: <span className="is-capitalized">{this.props.match?.params?.id ? (this.state.data?.label ?? '') : 'Nouveau'}</span>, key: 'teamOne', isCurrentItem: true },
        ])

        const commandRead = [
            {
                key: 'editItem',
                text: 'Modifier',
                iconProps: { iconName: 'Edit' },
                onClick: () => this.setState({ readOnly: !this.state.readOnly }, () => this.props.setCommand(commandEdit))
            }
        ]

        const commandEdit = [
            {
                key: 'cancel',
                text: 'Annuler',
                iconProps: { iconName: 'Cancel' },
                onClick: () => this.setState({ readOnly: !this.state.readOnly, data: { ...this.state.initData } }, () => this.props.setCommand(commandRead)),
                disabled: !this.props.match?.params?.id
            },
            {
                key: 'saveItem',
                text: 'Enregistrer',
                iconProps: { iconName: 'Save' },
                onClick: () => {
                    this.setState({ isLoading: true, readOnly: true }, () => {
                        this.props.setCommand([])
                        if (!!this.props.match?.params?.id) {
                            request.editTeam(this.props.match?.params?.id, { ...this.state.data })
                                .then(res => this.setState({ data: res }, () => {
                                    this.props.setCommand(commandRead)
                                    this.props.setMessageBar(true, MessageBarType.success, 'L\'équipe à bien été modifiée.')
                                    this.props.setBreadcrumb([
                                        { text: 'Équipe', key: 'teams' },
                                        { text: 'Toutes les équipes', key: 'all-teams', onClick: () => history.push('/equipes') },
                                        { text: `${this.props.match?.params?.id ? (this.state.data?.label ?? '') : 'Nouveau'}`, key: 'teamOne', isCurrentItem: true },
                                    ])
                                }))
                                .catch(err => {
                                    this.props.setCommand(commandEdit)
                                    this.setState({ readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err)
                                })
                                .finally(() => this.setState({ isLoading: false }))
                        } else {
                            request.createTeam({ ...this.state.data })
                                .then(data => {
                                    this.props.setMessageBar(true, MessageBarType.success, 'L\'équipe à bien été créée.')
                                    history.push(`/equipe/${data.id}`)
                                })
                                .catch(err => {
                                    this.props.setCommand(commandEdit)
                                    this.setState({ isLoading: false, readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err)
                                })
                        }
                    })
                }
            },
            {
                key: 'deleteItem',
                text: 'Supprimer',
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                    this.props.setModal(
                        true,
                        "Supprimer l'équipe",
                        "Êtes-vous certains de vouloir supprimer l'équipe ? Cette action est définitive.",
                        () => {
                            this.setState({ isLoading: true, readOnly: true }, () => {
                                request.deleteTeam(this.props.match?.params?.id)
                                    .then(() => {
                                        this.props.setCommand(commandRead)
                                        this.props.setMessageBar(true, MessageBarType.success, 'L\'équipe à bien été supprimée.')
                                        history.push('/equipes')
                                    })
                                    .catch(err => {
                                        this.setState({ readOnly: false, isLoading: false })
                                        this.props.setCommand(commandEdit)
                                        this.props.setMessageBar(true, MessageBarType.error, err)
                                    })
                            })
                        }
                    )
                },
                disabled: !this.props.match?.params?.id
            },
        ]

        this.props.setCommand(!this.props.match?.params?.id ? commandEdit : commandRead)
    }

    render() {
        const { readOnly, data, isLoading } = this.state

        if (isLoading) return <Loader />

        return (
            <section id="team-one">
                <div className="card" >
                    <div className="head">
                        <h1><Icon iconName='Teamwork' /> Toutes les informations sur l'équipe: <span className="is-capitalized">{this.props.match?.params?.id ? (this.state.data?.label ?? '') : 'Nouveau'}</span></h1>
                    </div>
                    <Text variant="large" block><Icon iconName='BulletedList' /> Informations générales</Text>
                    <Divider />
                    <Columns>
                        <Columns.Column>
                            <Label required htmlFor="label">Label</Label>
                            <TextField
                                id="label"
                                placeholder="Label"
                                value={data?.label ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, label: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.label?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label required htmlFor="label_google_contact">Label Google Contact</Label>
                            <TextField
                                id="label_google_contact"
                                placeholder="Label Google Contact"
                                value={data?.label_google_contact ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, label_google_contact: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.label_google_contact?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column/>
                        <Columns.Column/>
                    </Columns>
                </div>
                <br/>
                <div className="card" >
                    <Text variant="large" block><Icon iconName='RecruitmentManagement' /> Les membres</Text>
                    <Divider />
                    <Label>Membre(s) associé(s)</Label>
                    {data?.members?.length
                        ?
                        <DetailsList
                            items={data?.members ?? []}
                            onActiveItemChanged={item => history.push(`/membre/${item.id}`)}
                            columns={[
                                {
                                    key: 'lastname',
                                    name: 'Nom',
                                    fieldName: 'lastname',
                                    minWidth: 70,
                                    maxWidth: 200,
                                    isResizable: true,
                                },
                                {
                                    key: 'firstname',
                                    name: 'Prénom',
                                    fieldName: 'firstname',
                                    minWidth: 70,
                                    maxWidth: 200,
                                    isResizable: true,
                                },
                                {
                                    key: 'season',
                                    name: 'Saison',
                                    fieldName: 'season',
                                    minWidth: 70,
                                    maxWidth: 200,
                                    isResizable: true,
                                    onRender: member => <span className="is-capitalized">{member?.season?.label}</span>
                                }
                            ]}
                            selectionMode={SelectionMode.none}
                        />
                        :
                        <TextField defaultValue="Aucun résultat" borderless={true} readOnly={true} />
                    }
                </div>
            </section >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: data => dispatch(setBreadcrumb(data)),
        setCommand: data => dispatch(setCommand(data)),
        setMessageBar: (isDisplayed, type, message) => dispatch(setMessageBar(isDisplayed, type, message)),
        setModal: (show, title, subTitle, callback) => dispatch(setModal(show, title, subTitle, callback)),
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me,
        param: state.user.param
    }
}
const TeamOne = connect(mapStateToProps, mapDispatchToProps)(_TeamOne)
export default TeamOne
