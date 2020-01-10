import React from 'react'
import { Columns } from 'react-bulma-components'
import { Label, TextField, MessageBarType, IconButton, MaskedTextField, Dropdown } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import request from 'helper/request'
import { dateToString, stringToCleanString, stringToDate } from 'helper/date'
import DropdownIcon from 'component/dropdown'

class _Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            president_firstname: props.param?.global?.find(x => x.label === 'president_firstname')?.value,
            president_lastname: props.param?.global?.find(x => x.label === 'president_lastname')?.value,
            price_deadline: props.param?.global?.find(x => x.label === 'price_deadline')?.value,
            new_member_deadline: props.param?.global?.find(x => x.label === 'new_member_deadline')?.value,
            is_create_new_user_able: props.param?.global?.find(x => x.label === 'is_create_new_user_able')?.value,
            is_create_new_member_able: props.param?.global?.find(x => x.label === 'is_create_new_member_able')?.value,
            current_season: props.param?.season?.find(x => x.is_current)?.id,
            text_infos_admin: props.param?.global?.find(x => x.label === 'text_infos_admin')?.value,
            text_infos_user: props.param?.global?.find(x => x.label === 'text_infos_user')?.value,

        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Administration', key: 'administration' },
            { text: 'Les paramètres', key: 'settings', isCurrentItem: true },
        ])
        this.props.setCommand([])
    }

    render() {
        const { param } = this.props
        return (
            <section id="admin-settings">
                <div className="card" >
                    <Columns>
                        <Columns.Column>
                            <Label required htmlFor="president_firstname">Prénom du président</Label>
                            <div className="flex-row">
                                <TextField
                                    id="president_firstname"
                                    defaultValue={this.state.president_firstname}
                                    onBlur={ev => this.setState({ president_firstname: ev.target.value })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editParam('president_firstname', this.state.president_firstname)
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
                        </Columns.Column>
                        <Columns.Column>
                            <Label required htmlFor="president_lastname">Nom du président</Label>
                            <div className="flex-row">
                                <TextField
                                    id="president_lastname"
                                    defaultValue={this.state.president_lastname}
                                    onBlur={ev => this.setState({ president_lastname: ev.target.value })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editParam('president_lastname', this.state.president_lastname)
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
                        </Columns.Column>
                        <Columns.Column className="is-hidden-touch"/>
                        <Columns.Column className="is-hidden-touch"/>
                    </Columns>
                    <Columns>
                        <Columns.Column>
                            <Label required htmlFor="price_deadline">Deadline prix inscription</Label>
                            <div className="flex-row">
                                <MaskedTextField
                                    id="price_deadline"
                                    value={stringToCleanString(this.state.price_deadline)}
                                    mask={"99/99/9999"}
                                    onBlur={ev => this.setState({ price_deadline: stringToDate(ev.target.value) })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editParam('price_deadline', dateToString(this.state.price_deadline))
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
                        </Columns.Column>
                        <Columns.Column>
                            <Label required htmlFor="new_member_deadline">Deadline insc./modif. membres</Label>
                            <div className="flex-row">
                                <MaskedTextField
                                    id="new_member_deadline"
                                    value={stringToCleanString(this.state.new_member_deadline)}
                                    mask={"99/99/9999"}
                                    onBlur={ev => this.setState({ new_member_deadline: stringToDate(ev.target.value) })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editParam('new_member_deadline', dateToString(this.state.new_member_deadline))
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
                        </Columns.Column>
                        <Columns.Column>
                            <Label required htmlFor="is_create_new_member_able">Autoriser insc./modif. membres</Label>
                            <div className="flex-row">
                                <DropdownIcon
                                    id="is_create_new_member_able"
                                    selectedKey={this.state.is_create_new_member_able?.toString() ?? 'false'}
                                    options={param?.choices}
                                    onChange={(ev, item) => this.setState({ is_create_new_member_able: item.key })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editParam('is_create_new_member_able', this.state.is_create_new_member_able)
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
                        </Columns.Column>
                        <Columns.Column>
                            <Label required htmlFor="is_create_new_user_able">Autoriser inscription utilisateurs</Label>
                            <div className="flex-row">
                                <DropdownIcon
                                    id="is_create_new_user_able"
                                    selectedKey={this.state.is_create_new_user_able?.toString() ?? 'false'}
                                    options={param?.choices}
                                    onChange={(ev, item) => this.setState({ is_create_new_user_able: item.key })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editParam('is_create_new_user_able', this.state.is_create_new_user_able)
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
                        </Columns.Column>

                    </Columns>

                    <Columns>
                        <Columns.Column>
                            <Label required htmlFor="current_season">Saison en cours</Label>
                            <div className="flex-row">
                                <Dropdown
                                    options={[...param?.season]?.map(x => { return { key: x.id, text: x.label } })}
                                    selectedKey={this.state.current_season}
                                    onChange={(ev, item) => this.setState({ current_season: item.key })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editCurrentSeason(this.state.current_season)
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
                        </Columns.Column>
                        <Columns.Column className="is-hidden-touch"/>
                        <Columns.Column className="is-hidden-touch"/>
                        <Columns.Column className="is-hidden-touch"/>
                    </Columns>
                    <Columns>
                        <Columns.Column>
                            <Label required htmlFor="text_infos_admin">Textes informations admin.</Label>
                            <div className="flex-row">
                                <TextField
                                    id="text_infos_admin"
                                    multiline
                                    autoAdjustHeight
                                    defaultValue={this.state.text_infos_admin}
                                    onBlur={ev => this.setState({ text_infos_admin: ev.target.value })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editParam('text_infos_admin', this.state.text_infos_admin)
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
                        </Columns.Column>
                        <Columns.Column>
                            <Label required htmlFor="text_infos_user">Textes informations util.</Label>
                            <div className="flex-row">
                                <TextField
                                    id="text_infos_user"
                                    multiline
                                    autoAdjustHeight
                                    defaultValue={this.state.text_infos_user}
                                    onBlur={ev => this.setState({ text_infos_user: ev.target.value })}
                                />
                                <IconButton
                                    iconProps={{ iconName: 'Save' }}
                                    title="Enregistrer"
                                    onClick={() => request.editParam('text_infos_admin', this.state.text_infos_admin)
                                        .then(() => this.props.setMessageBar(true, MessageBarType.success, "L'élément à bien été mise à jour."))
                                        .catch(err => this.props.setMessageBar(true, MessageBarType.error, err))
                                    }
                                />
                            </div>
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
const Settings = connect(mapStateToProps, mapDispatchToProps)(_Settings)
export default Settings
