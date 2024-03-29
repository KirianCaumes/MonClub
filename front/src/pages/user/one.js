import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, MessageBarType, Dropdown, Text, Icon, VirtualizedComboBox, DetailsList, SelectionMode, CommandBarButton, TooltipHost, DirectionalHint, TooltipDelay, getTheme } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setLoading } from 'redux/actions/common'
import { history } from 'helper/history'
import request from 'helper/request'
import Loader from 'component/loader'
import { ROLE_COACH } from 'helper/constants'
import Divider from 'component/divider'
import getWf from 'helper/getStepWf'
import getHighestRole from 'helper/getHighestRole'

class _UserOne extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            readOnly: !!this.props.match?.params?.id,
            isLoading: false,
            data: { ...props?.data?.user ?? {} },
            members: [...props?.data?.members ?? []],
            initData: { ...props?.data?.user ?? {} },
            errorField: {}
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Administration', key: 'administration' },
            { text: 'Les comptes', key: 'users', onClick: () => history.push('/utilisateurs') },
            { text: <span className="is-capitalized">{this.props.match?.params?.id ? (this.state.data?.username ?? '') : 'Nouveau'}</span>, key: 'userOne', isCurrentItem: true },
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
                onClick: () => this.setState({ readOnly: !this.state.readOnly, data: { ...this.state.initData }, errorField: {} }, () => this.props.setCommand(commandRead)),
                disabled: !this.props.match?.params?.id
            },
            {
                key: 'saveItem',
                text: 'Enregistrer',
                iconProps: { iconName: 'Save' },
                onClick: () => {
                    this.setState({ isLoading: true, readOnly: true }, () => {
                        if (!!this.props.match?.params?.id) {
                            this.props.setCommand([])
                            this.fetchEditUser = request.editUser(this.props.match?.params?.id, { ...this.state.data })
                            this.fetchEditUser
                                .fetch()
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
                        } else {
                            this.props.setCommand([])
                            this.fetchCreateUser = request.createUser({ ...this.state.data })
                            this.fetchCreateUser
                                .fetch()
                                .then(res => {
                                    this.props.setMessageBar(true, MessageBarType.success, 'L\'utilisateur à bien été créé.')
                                    history.push(`/utilisateur/${res?.id}`)
                                })
                                .catch(err => {
                                    this.props.setCommand(commandEdit)
                                    this.setState({ isLoading: false, readOnly: false, errorField: err?.form?.children })
                                    this.props.setMessageBar(true, MessageBarType.error, err)
                                })

                        }
                    })
                },
                commandBarButtonAs: (props) => {
                    if (!this.props.match?.params?.id) {
                        return (
                            <TooltipHost
                                content={"Un mail sera automatiquement envoyé au nouvel utilisateur pour qu'il puisse réinitialiser son mot de passe et se connecter à l'application"}
                                directionalHint={DirectionalHint.topCenter}
                                delay={TooltipDelay.zero}
                            >
                                <CommandBarButton {...props} />
                            </TooltipHost>
                        )
                    } else {
                        return (
                            <CommandBarButton {...props} />
                        )
                    }
                },
            },
        ]

        this.props.setCommand(!this.props.match?.params?.id ? commandEdit : commandRead)
    }

    componentWillUnmount() {
        if (this.fetchEditUser) this.fetchEditUser.cancel()
        if (this.fetchCreateUser) this.fetchCreateUser.cancel()
    }

    render() {
        const { readOnly, data, members, isLoading } = this.state
        const { param } = this.props

        if (isLoading) return <Loader />

        return (
            <section id="user-one">
                <div className="card" >
                    <Text variant="large" block><Icon iconName='BulletedList' /> Informations générales</Text>
                    <Divider />
                    <Columns>
                        <Columns.Column>
                            <Label disabled={!readOnly} required htmlFor="username">Email</Label>
                            <TextField
                                id="username"
                                placeholder="Nom"
                                defaultValue={data?.username ?? ''}
                                onBlur={ev => this.setState({ data: { ...this.state.data, username: ev.target.value } })}
                                borderless={readOnly ? true : this.props.match?.params?.id}
                                readOnly={readOnly ? true : this.props.match?.params?.id}
                                errorMessage={this.state.errorField?.username?.errors?.[0]}
                            />
                        </Columns.Column>
                        <Columns.Column size="one-quarter">
                            <Label htmlFor="roles">Roles</Label>
                            {
                                readOnly ?
                                    <div className="flex-row flex-start">
                                        <Icon
                                            className="flex-col"
                                            iconName={this.props?.param?.roles?.find(y => y?.key === getHighestRole(data?.roles))?.icon}
                                            styles={{ root: { color: getTheme().palette.themePrimary, verticalAlign: 'bottom' } }}
                                        />
                                        <TextField
                                            id="roles"
                                            defaultValue={data?.roles?.length ? data?.roles.map(x => param?.roles?.find(y => y?.key === x)?.text)?.join(', ') : 'Utilisateur'}
                                            borderless={true}
                                            readOnly={true}
                                            errorMessage={this.state.errorField?.roles?.errors?.[0]}
                                        />
                                    </div>
                                    :
                                    <Dropdown
                                        id="roles"
                                        multiSelect
                                        selectedKeys={data?.roles}
                                        options={[...param?.roles]}
                                        errorMessage={this.state.errorField?.roles?.errors?.[0]}
                                        onChange={(ev, item) => {
                                            const newSelectedItems = [...data?.roles]
                                            if (item.selected) {
                                                newSelectedItems.push(item.key)
                                            } else {
                                                const currIndex = newSelectedItems.findIndex(x => x === item.key)
                                                if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                            }
                                            this.setState({ data: { ...this.state.data, roles: newSelectedItems } })
                                        }}
                                        onRenderOption={option => (
                                            <>
                                                {option.icon && <>&nbsp;<Icon iconName={option.icon} styles={{ root: { color: getTheme().palette.themePrimary } }} />&nbsp;</>}
                                                <span>{option.text}</span>
                                            </>
                                        )}
                                        onRenderTitle={options => (
                                            options?.map((option, i) => (
                                                <React.Fragment key={i}>
                                                    {option.icon && <>&nbsp;<Icon iconName={option.icon} styles={{ root: { color: getTheme().palette.themePrimary } }} />&nbsp;</>}
                                                    <span>{option.text}</span>
                                                    {options?.length - 1 > i && <>, </>}
                                                </React.Fragment>
                                            ))
                                        )}
                                    />
                            }
                        </Columns.Column>
                        <Columns.Column>
                            <Label htmlFor="enabled">Activé</Label>
                            {
                                readOnly ?
                                    <TextField
                                        id="enabled"
                                        defaultValue={param?.choices?.find(x => x.key === data?.enabled?.toString())?.text ?? ''}
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
                        <Columns.Column size="one-quarter">
                            {
                                data?.roles?.includes(ROLE_COACH) &&
                                <>
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
                                                allowFreeform={false}
                                                autoComplete={"on"}
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
                                </>
                            }
                        </Columns.Column>
                    </Columns>
                    <Columns>
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
                        <Columns.Column />
                        <Columns.Column />
                    </Columns>
                </div>
                <br />
                <div className="card" >
                    <Text variant="large" block><Icon iconName='RecruitmentManagement' /> Les membres</Text>
                    <Divider />
                    <Label>Membre(s) associé(s)</Label>
                    {members?.length
                        ?
                        <DetailsList
                            items={members ?? []}
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
                                },
                                {
                                    key: 'step',
                                    name: 'Étape',
                                    minWidth: 70,
                                    maxWidth: 200,
                                    isResizable: true,
                                    onRender: member => <span className="is-capitalized">{getWf(member)}</span>
                                },
                                {
                                    key: 'team',
                                    name: 'Équipe(s)',
                                    minWidth: 70,
                                    maxWidth: 200,
                                    isResizable: true,
                                    onRender: member => <span className="is-capitalized">{member.teams?.map(team => team.label)?.join(', ')}</span>
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
