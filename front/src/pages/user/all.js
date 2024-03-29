import React from 'react'
import { Columns } from 'react-bulma-components'
import { ShimmeredDetailsList, MessageBarType, SelectionMode, Text, Icon, Separator, Label, DefaultButton, Dropdown, TextField, getTheme } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { history } from 'helper/history'
import request from 'helper/request'
import ParentPage from 'pages/_parentPage'
import DropdownIcon from 'component/dropdown'
import getHighestRole from 'helper/getHighestRole'

class _UsersAll extends ParentPage {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            items: [],
            searchParms: {
                name: '',
                isEnabled: true,
                roles: []
            },
            columns: [
                {
                    key: 'username',
                    name: 'Nom',
                    fieldName: 'username',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    isSorted: true,
                    isSortedDescending: false,
                    onRender: user => <span className="is-capitalized">{user.username}</span>
                },
                {
                    key: 'enabled',
                    name: 'Activé',
                    fieldName: 'enabled',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: user => <span className="is-capitalized">{user.enabled ? 'Oui' : 'Non'}</span>
                },
                {
                    key: 'roles',
                    name: 'Roles',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: user => <span className="is-capitalized">
                        <Icon
                            iconName={this.props?.param?.roles?.find(y => y?.key === getHighestRole(user?.roles))?.icon}
                            styles={{ root: { color: getTheme().palette.themePrimary, verticalAlign: 'bottom' } }}
                        />&nbsp;
                        {user?.roles?.length ? user?.roles?.map(x => this.props?.param?.roles?.find(y => y?.key === x)?.text)?.join(', ') : 'Utilisateur'}
                    </span>
                }
            ]
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Administration', key: 'administration' },
            { text: 'Les comptes', key: 'users', isCurrentItem: true },
        ])


        this.props.setCommand([
            {
                key: 'newItem',
                text: 'Nouveau',
                iconProps: { iconName: 'Add' },
                onClick: () => history.push('/utilisateur/nouveau')
            },
        ])

        this.searchUsers()
    }

    componentWillUnmount() {
        if (this.fetchGetAllUsers) this.fetchGetAllUsers.cancel()
    }

    searchUsers() {
        this.setState({ isLoading: true }, () => {
            this.fetchGetAllUsers = request.getAllUsers(this.state.searchParms)
            this.fetchGetAllUsers
                .fetch()
                .then(data => this.setState({ items: data }))
                .catch(err => {
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
                .finally(() => this.setState({ isLoading: false }))
        })
    }

    render() {
        const { isLoading } = this.state
        const { param } = this.props

        return (
            <section id="user-all">
                <div className="card" >
                    <form onSubmit={ev => { ev.preventDefault(); this.searchMembers() }} >
                        <Columns className="search-inputs">
                            <Columns.Column >
                                <TextField
                                    label="Nom"
                                    placeholder="Nom"
                                    disabled={isLoading}
                                    value={this.state.searchParms.name}
                                    onChange={ev => this.setState({ searchParms: { ...this.state.searchParms, name: ev.target.value } })}
                                />
                            </Columns.Column>
                            <Columns.Column >
                                <Label required htmlFor="is_enabled">Activé</Label>
                                <DropdownIcon
                                    id="is_enabled"
                                    disabled={isLoading}
                                    icon={param?.choices?.find(x => x.key === 'true')?.icon ?? ''}
                                    valueDisplay={'Oui'}
                                    selectedKey={this.state.searchParms?.isEnabled?.toString()}
                                    options={param?.choices}
                                    onChange={(ev, item) => this.setState({ searchParms: { ...this.state.searchParms, isEnabled: JSON.parse(item.key) } })}
                                />
                            </Columns.Column>
                            <Columns.Column size="one-quarter">
                                <Dropdown
                                    label="Rôles"
                                    placeholder="Rôles"
                                    disabled={isLoading}
                                    multiSelect
                                    options={this.props.param?.roles}
                                    selectedKeys={this.state.searchParms.roles}
                                    onChange={(ev, item) => {
                                        const newSelectedItems = [...this.state.searchParms.roles]
                                        if (item.selected) {
                                            newSelectedItems.push(item.key)
                                        } else {
                                            const currIndex = newSelectedItems.indexOf(item.key)
                                            if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                        }
                                        this.setState({ searchParms: { ...this.state.searchParms, roles: newSelectedItems } })
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
                            </Columns.Column>
                            <Columns.Column size="one-quarter">
                                <Label>&#8203;</Label>
                                <DefaultButton
                                    text="Rechercher"
                                    primary={true}
                                    split={true}
                                    disabled={isLoading}
                                    onClick={() => this.searchUsers()}
                                    iconProps={{ iconName: 'Search' }}
                                    menuProps={
                                        {
                                            items: [
                                                {
                                                    key: 'search',
                                                    text: 'Rechercher',
                                                    iconProps: { iconName: 'Search' },
                                                    onClick: () => this.searchMembers()
                                                },
                                                {
                                                    key: 'Clear',
                                                    text: 'Effacer les filtres',
                                                    iconProps: { iconName: 'ClearFilter' },
                                                    onClick: () => this.setState({
                                                        searchParms: {
                                                            name: '',
                                                            isEnabled: 'true',
                                                            roles: []
                                                        }
                                                    }, () => this.searchUsers())
                                                }
                                            ]
                                        }
                                    }
                                />
                            </Columns.Column>
                        </Columns>
                    </form>
                    <br />
                    <Separator >
                        <Icon iconName="ChevronDown" />
                    </Separator>
                    <br />
                    <ShimmeredDetailsList
                        items={this.state.items}
                        onActiveItemChanged={item => history.push(`/utilisateur/${item.id}`)}
                        onColumnHeaderClick={this._onColumnClick.bind(this, { colName: "columns", dataName: ['items'], source: "state", action: "", exclude: ['roles'] })}
                        columns={this.state.columns}
                        selectionMode={SelectionMode.none}
                        enableShimmer={this.state.isLoading}
                    />
                    {this.state.items.length === 0 && !this.state.isLoading && <Text variant="large" className="has-text-centered" block>Aucun résultat</Text>}
                </div >
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
const UsersAll = connect(mapStateToProps, mapDispatchToProps)(_UsersAll)
export default UsersAll
