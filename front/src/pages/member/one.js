import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, Separator, MessageBarType, Text } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import request from '../../helper/request'
import Workflow from '../../component/workflow'

class _MemberOne extends React.Component {
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
            { text: 'Membres', key: 'members' },
            { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
            { text: `${this.props.match?.params?.id ? ((this.props.data?.firstname ?? '') + ' ' + (this.props.data?.lastname ?? '')) : 'Nouveau'}`, key: 'member', isCurrentItem: true },
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
                            request.editMember(this.props.match?.params?.id, { label: this.state.data?.label ?? '' })
                                .then(data => this.setState({ data }, () => {
                                    this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été modifiée.')
                                    this.props.setBreadcrumb([
                                        { text: 'Membres', key: 'members' },
                                        { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
                                        { text: `${this.props.match?.params?.id ? (this.props.data?.firstname ?? '' + this.props.data?.lastname ?? '') : 'Nouveau'}`, key: 'member', isCurrentItem: true },
                                    ])
                                }))
                                .catch(err => {
                                    this.setState({ readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err.message ?? err.error?.message ?? 'Une erreur est survenue.')
                                })
                                .finally(() => this.setState({ isLoading: false }))
                        } else {
                            request.createMember({ label: this.state.data?.label ?? '' })
                                .then(data => {
                                    this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été créée.')
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
                        request.deleteMember(this.props.match?.params?.id)
                            .then(() => {
                                this.props.setMessageBar(true, MessageBarType.success, 'Le membre à bien été supprimée.')
                                history.push('/membres')
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
        const { readOnly, data, isLoading } = this.state

        return (
            <section id="member-one">
                <div className="card" >
                    <Workflow />
                    <br/>
                    <Text variant="large" block>Informations générales</Text>
                    <Separator />
                    <br />
                    <Columns>
                        <Columns.Column>
                            <Label>Prénom</Label>
                            <TextField
                                value={data?.firstname ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, firstname: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.firstname?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label>Nom</Label>
                            <TextField
                                value={data?.lastname ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, lastname: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.lastname?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label>Date de naissance</Label>
                            <TextField
                                value={data?.birthdate ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, birthdate: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.birthdate?.errors?.[0]}
                            />
                        </Columns.Column>
                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Label>Profession</Label>
                            <TextField
                                value={data?.profession ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, profession: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.profession?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label>Email</Label>
                            <TextField
                                value={data?.email ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, email: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.email?.errors?.[0]}
                            />
                        </Columns.Column>

                        <Columns.Column>
                            <Label>Numéro de téléphone</Label>
                            <TextField
                                value={data?.phone_number ?? ''}
                                onChange={ev => this.setState({ data: { ...this.state.data, phone_number: ev.target.value } })}
                                borderless={readOnly}
                                readOnly={readOnly}
                                errorMessage={this.state.errorField?.phone_number?.errors?.[0]}
                            />
                        </Columns.Column>
                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Text variant="large" block>Parent 1</Text>
                            <Separator />
                            <br />
                            <Columns>
                                <Columns.Column>
                                    <Label>Prénom</Label>
                                    <TextField
                                        value={data?.parent_one_firstname ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_firstname: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_firstname?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <Label>Nom</Label>
                                    <TextField
                                        value={data?.parent_one_lastname ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_lastname: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_lastname?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                            <Columns>
                                <Columns.Column>
                                    <Label>Email</Label>
                                    <TextField
                                        value={data?.parent_one_email ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_email: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_email?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <Label>Numéro de téléphone</Label>
                                    <TextField
                                        value={data?.parent_one_phone_number ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_phone_number: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_phone_number?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                            <Columns>
                                <Columns.Column>
                                    <Label>Profession</Label>
                                    <TextField
                                        value={data?.parent_one_profession ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_one_profession: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_one_profession?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                        </Columns.Column>
                        {/* <Separator vertical /> */}
                        <Columns.Column>
                            <Text variant="large" block>Parent 2</Text>
                            <Separator />
                            <br />
                            <Columns>
                                <Columns.Column>
                                    <Label>Prénom</Label>
                                    <TextField
                                        value={data?.parent_two_firstname ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_firstname: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_firstname?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <Label>Nom</Label>
                                    <TextField
                                        value={data?.parent_two_lastname ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_lastname: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_lastname?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                            <Columns>
                                <Columns.Column>
                                    <Label>Email</Label>
                                    <TextField
                                        value={data?.parent_two_email ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_email: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_email?.errors?.[0]}
                                    />
                                </Columns.Column>
                                <Columns.Column>
                                    <Label>Numéro de téléphone</Label>
                                    <TextField
                                        value={data?.parent_two_phone_number ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_phone_number: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_phone_number?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
                            <Columns>
                                <Columns.Column>
                                    <Label>Profession</Label>
                                    <TextField
                                        value={data?.parent_two_profession ?? ''}
                                        onChange={ev => this.setState({ data: { ...this.state.data, parent_two_profession: ev.target.value } })}
                                        borderless={readOnly}
                                        readOnly={readOnly}
                                        errorMessage={this.state.errorField?.parent_two_profession?.errors?.[0]}
                                    />
                                </Columns.Column>
                            </Columns>
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
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me,
        param: state.user.param
    }
}
const MemberOne = connect(mapStateToProps, mapDispatchToProps)(_MemberOne)
export default MemberOne
