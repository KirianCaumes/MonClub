import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, MessageBarType, Dropdown } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar, setLoading } from 'redux/actions/common'
import { history } from 'helper/history'
import request from 'helper/request'
import Loader from 'component/loader'

class _UserOne extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            readOnly: !!this.props.match?.params?.id,
            isLoading: false,
            data: { ...props?.data ?? {} },
            errorField: {}
        }

        this.choice = [
            { key: 'true', text: 'Oui' },
            { key: 'false', text: 'Non' },
        ]
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Administration', key: 'administration' },
            { text: 'Les comptes', key: 'users', onClick: () => history.push('/utilisateurs') },
            { text: `${this.props.match?.params?.id ? (this.state.data?.username ?? '') : ''}`, key: 'userOne', isCurrentItem: true },
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
                        this.props.setCommand([])
                        request.editUser(this.props.match?.params?.id, { ...this.state.data })
                            .then(res => this.setState({ data: res }, () => {
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

        if (isLoading) return <Loader />

        return (
            <section id="user-one">
                <div className="card" >
                    <Columns>
                        <Columns.Column>
                            <Label disabled={!readOnly}>Nom</Label>
                            <TextField
                                value={data?.username ?? ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>
                        <Columns.Column size="one-third">
                            <Label>Roles</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={data?.roles?.join(', ')}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.is_reduced_price?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
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
                            <Label>Activé</Label>
                            {
                                readOnly ?
                                    <TextField
                                        defaultValue={this.choice.find(x => x.key === data?.enabled?.toString()).text ?? ''}
                                        borderless={true}
                                        readOnly={true}
                                        errorMessage={this.state.errorField?.enabled?.errors?.[0]}
                                    />
                                    :
                                    <Dropdown
                                        defaultSelectedKey={data?.enabled?.toString() ?? 'false'}
                                        options={this.choice}
                                        errorMessage={this.state.errorField?.enabled?.errors?.[0]}
                                        onChange={(ev, item) => this.setState({ data: { ...this.state.data, enabled: JSON.parse(item.key) } })}
                                    />
                            }
                        </Columns.Column>
                    </Columns>
                    <Columns>
                        <Columns.Column>
                            <Label disabled={!readOnly}>Date de création</Label>
                            <TextField
                                value={data?.creation_datetime ? (new Date(data.creation_datetime)).toLocaleString('fr-FR') : ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>
                        <Columns.Column>
                            <Label disabled={!readOnly}>Dernière connexion</Label>
                            <TextField
                                value={data?.last_login ? (new Date(data.last_login)).toLocaleString('fr-FR') : ''}
                                borderless={true}
                                readOnly={true}
                            />
                        </Columns.Column>
                        <Columns.Column />
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
