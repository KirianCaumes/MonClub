import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, DetailsList, SelectionMode, MessageBarType } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setLoading } from '../../redux/actions/common'
import { history } from '../../helper/history'
import request from '../../helper/request'
import withSimpleLoading from '../../helper/hoc/withSimpleLoading'

class _TeamOne extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            readOnly: !!this.props.match?.params?.id,
            isLoading: false,
            data: { ...props?.data ?? {} },
            errorField: {}
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Équipe', key: 'teams' },
            { text: 'Toutes les équipes', key: 'all-teams', onClick: () => history.push('/equipes') },
            { text: `${this.props.match?.params?.id ? (this.props.data?.label ?? '') : 'Nouveau'}`, key: 'teamOne', isCurrentItem: true },
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
                onClick: () => this.setState({ readOnly: !this.state.readOnly }, () => this.props.setCommand(commandRead)),
                disabled: !this.props.match?.params?.id
            },
            {
                key: 'saveItem',
                text: 'Enregistrer',
                iconProps: { iconName: 'Save' },
                onClick: () => {
                    this.setState({ isLoading: true, readOnly: true }, () => {
                        this.props.setCommand(commandRead)
                        if (!!this.props.match?.params?.id) {
                            request.editTeam(this.props.match?.params?.id, { label: this.state.data?.label ?? '' })
                                .then(data => this.setState({ data }, () => this.props.setMessageBar(true, MessageBarType.success, 'L\'équipe à bien été modifiée.')))
                                .catch(err => {
                                    this.setState({ readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                })
                                .finally(() => this.setState({ isLoading: false }))
                        } else {
                            request.createTeam({ label: this.state.data?.label ?? '' })
                                .then(data => {
                                    this.props.setMessageBar(true, MessageBarType.success, 'L\'équipe à bien été créée.')
                                    history.push(`/equipe/${data.id}`)
                                })
                                .catch(err => {
                                    this.setState({ readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                })
                                .finally(() => this.setState({ isLoading: false }))
                        }
                    })
                }
            },
            {
                key: 'deleteItem',
                text: 'Supprimer',
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                    this.setState({ isLoading: true, readOnly: true }, () => {
                        request.deleteTeam(this.props.match?.params?.id)
                            .then(() => {
                                this.props.setMessageBar(true, MessageBarType.success, 'L\'équipe à bien été supprimée.')
                                history.push('/equipes')
                            })
                            .catch(err => this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.'))
                            .finally(() => this.setState({ isLoading: false }))
                    })
                },
                disabled: !this.props.match?.params?.id
            },
        ]

        this.props.setCommand(!this.props.match?.params?.id ? commandEdit : commandRead)
    }

    render() {
        // const { data } = this.props
        const { readOnly, data, isLoading } = this.state
        // if (this.state.isLoading) return <Loader />

        return withSimpleLoading(isLoading,
            <section id="team-one">
                <div className="card" >
                    <Columns>
                        <Columns.Column>
                            <Label>Label</Label>
                            <TextField
                                value={data?.label}
                                onChange={ev => this.setState({ data: { ...this.state.data, label: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.label?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
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
                                        }
                                    ]}
                                    selectionMode={SelectionMode.none}
                                />
                                :
                                <TextField defaultValue="Aucun résultat" borderless={true} readOnly={true} />
                            }

                            {/* {
                                data?.members?.length &&
                                <ul>
                                    {
                                        data?.members?.map(member => <li>{member.firstname} {member.lastname}</li>)
                                    }
                                </ul>
                            } */}

                        </Columns.Column>
                    </Columns>
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
        setLoading: bool => dispatch(setLoading(bool))
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
