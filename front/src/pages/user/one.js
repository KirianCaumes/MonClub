import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, MessageBarType, Dropdown, Text, Icon, VirtualizedComboBox } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setLoading } from 'redux/actions/common'
import { history } from 'helper/history'
import request from 'helper/request'
import Loader from 'component/loader'
import { ROLE_COACH } from 'helper/constants'
import Divider from 'component/divider'

class _UserOne extends React.PureComponent {
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
            { text: 'Administration', key: 'administration' },
            { text: 'Les comptes', key: 'users', onClick: () => history.push('/utilisateurs') },
            { text: <span className="is-capitalized">{this.props.match?.params?.id ? (this.state.data?.username ?? '') : ''}</span>, key: 'userOne', isCurrentItem: true },
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
                        request.editUser(this.props.match?.params?.id, { ...this.state.data })
                            .then(res => this.setState({ data: res, errorField: {} }, () => {
                                this.props.setCommand(commandRead)
                                this.props.setMessageBar(true, MessageBarType.success, 'L\'utilisateur à bien été modifiée.')
                            }))
                            .catch(err => {
                                this.props.setCommand(commandEdit)
                                this.setState({ readOnly: false, errorField: err?.form?.children })
                                this.props.setMessageBar(true, MessageBarType.error, err)
                            })
                            .finally(() => this.setState({ isLoading: false }))
                    })
                }
            },
        ]

        this.props.setCommand(!this.props.match?.params?.id ? commandEdit : commandRead)
    }

    render() {
        const { readOnly, data, isLoading } = this.state
        const { param } = this.props

        if (isLoading) return <Loader />

        return (
            <section id="user-one">
                <div className="card" >
                    <div className="head">
                        <h1><Icon iconName='Teamwork' /> Toutes les informations sur l'utilisateur: <span className="is-capitalized">{this.props.match?.params?.id ? (this.state.data?.username ?? '') : ''}</span></h1>
                    </div>
                    <Text variant="large" block><Icon iconName='BulletedList' /> Informations générales</Text>
                    <Divider />
                    <Columns>
                        <Columns.Column>
                            <Label disabled={!readOnly} htmlFor="username">Nom</Label>
                            <TextField
                                id="username"
                                placeholder="Nom"
                                value={data?.username ?? ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>
                        <Columns.Column size="one-third">
                            <Label htmlFor="roles">Roles</Label>
                            {
                                readOnly ?
                                    <TextField
                                        id="roles"
                                        placeholder="Roles"
                                        defaultValue={data?.roles?.join(', ')}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.roles?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        id="roles"
                                        multiSelect
                                        selectedKeys={data?.roles}
                                        options={[...this.props.param?.roles]?.map((x, i) => { return { key: x, text: x } })}
                                        errorMessage={this.state.errorField?.roles?.errors?.[0]}
                                        onChange={(ev, item) => {
                                            const newSelectedItems = [...data.roles]
                                            if (item.selected) {
                                                newSelectedItems.push(item.key)
                                            } else {
                                                const currIndex = newSelectedItems.findIndex(x => (x === item.key))
                                                if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                            }
                                            this.setState({ data: { ...this.state.data, roles: newSelectedItems } })
                                        }}
                                    />
                            }
                        </Columns.Column>
                        <Columns.Column>
                            <Label htmlFor="enabled">Activé</Label>
                            {
                                readOnly ?
                                    <TextField
                                        id="enabled"
                                        defaultValue={param?.choices.find(x => x.key === data?.enabled?.toString()).text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.enabled?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        id="enabled"
                                        defaultSelectedKey={data?.enabled?.toString() ?? 'false'}
                                        options={param?.choices}
                                        errorMessage={this.state.errorField?.enabled?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, enabled: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>
                    </Columns>
                    <Columns>
                        {
                            data?.roles.includes(ROLE_COACH) &&
                            <Columns.Column size="one-third">
                                <Label htmlFor="teams">Équipe(s)</Label>
                                {
                                    readOnly ?
                                        <TextField
                                            id="teams"
                                            placeholder="Équipe(s)"
                                            defaultValue={data?.teams?.map(team => team.label)?.join(', ')}
                                            borderless={true}
                                            readOnly={true}
                                            errorMessage={this.state.errorField?.teams?.errors?.[0]}
                                        />
                                        :
                                        <VirtualizedComboBox
                                            id="teams"
                                            multiSelect
                                            selectedKey={data?.teams?.map(x => x.id ?? x.key)}
                                            options={[...this.props.param?.teams]?.map(x => { return { ...x, key: x.id, text: x.label } })}
                                            errorMessage={this.state.errorField?.teams?.errors?.[0]}
                                            useComboBoxAsMenuWidth={true}
                                            onChange={(ev, item) => {
                                                const newSelectedItems = [...data.teams]
                                                if (item.selected) {
                                                    newSelectedItems.push(item)
                                                } else {
                                                    const currIndex = newSelectedItems.findIndex(x => ((x.key === item.key) || (x.key === item.id) || (x.id === item.key)))
                                                    if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                                }
                                                this.setState({ data: { ...this.state.data, teams: newSelectedItems } })
                                            }}

                                        />
                                }
                            </Columns.Column>
                        }
                        <Columns.Column>
                            <Label disabled={!readOnly} htmlFor="creation_datetime">Date de création</Label>
                            <TextField
                                id="creation_datetime"
                                value={data?.creation_datetime ? (new Date(data.creation_datetime)).toLocaleString('fr-FR') : ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label disabled={!readOnly} htmlFor="last_login">Dernière connexion</Label>
                            <TextField
                                id="last_login"
                                value={data?.last_login ? (new Date(data.last_login)).toLocaleString('fr-FR') : ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>
                        {!data?.roles.includes(ROLE_COACH) && <Columns.Column className="is-hidden-touch"/>}
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
const UserOne = connect(mapStateToProps, mapDispatchToProps)(_UserOne)
export default UserOne
