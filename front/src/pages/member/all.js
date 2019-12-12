import React from 'react'
import { Columns } from 'react-bulma-components'
import { Icon, ShimmeredDetailsList, MessageBarType, SelectionMode, Separator, TextField, DefaultButton, Label, Dropdown } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import '../../style/page/member/all.scss'
import request from '../../helper/request'
import getWf from '../../helper/getStepWf'
import { ROLE_ADMIN } from '../../helper/constants'

class _MembersAll extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            items: [],
            searchParms: {
                name: '',
                stepsId: [],
                teamsId: []
            }
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
        ])
        this.props.setCommand([])

        this.searchMembers()
    }

    searchMembers() {
        this.setState({ isLoading: true }, () => {
            request.getAllMembers(this.state.searchParms)
                .then(data => this.setState({ items: data }))
                .catch(err => {
                    this.props.setMessageBar(true, MessageBarType.error, err.toString())
                })
                .finally(() => this.setState({ isLoading: false }))
        })
    }

    render() {
        const { isLoading } = this.state
        return (
            <section id="members-all">
                <div className="card" >
                    {
                        this.props.me?.roles?.includes(ROLE_ADMIN) &&
                        <>
                            <form onSubmit={ev => { ev.preventDefault(); this.searchMembers() }} >
                                <Columns className="search-inputs">
                                    <Columns.Column size="one-quarter">
                                        <TextField
                                            label="Nom/Prénom"
                                            disabled={isLoading}
                                            value={this.state.searchParms.name}
                                            onChange={ev => this.setState({ searchParms: { ...this.state.searchParms, name: ev.target.value } })}
                                        />
                                    </Columns.Column>
                                    <Columns.Column size="one-quarter">
                                        <Dropdown
                                            label="Étape"
                                            disabled={isLoading}
                                            multiSelect
                                            options={[...this.props.param?.workflowStep]?.map(x => { return { key: x.id, text: x.label } })}
                                            selectedKeys={this.state.searchParms.stepsId}
                                            onChange={(ev, item) => {
                                                const newSelectedItems = [...this.state.searchParms.stepsId]
                                                if (item.selected) {
                                                    newSelectedItems.push(item.key)
                                                } else {
                                                    const currIndex = newSelectedItems.indexOf(item.key)
                                                    if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                                }
                                                this.setState({ searchParms: { ...this.state.searchParms, stepsId: newSelectedItems } })
                                            }}
                                        />
                                    </Columns.Column>
                                    <Columns.Column size="one-quarter">
                                        <Dropdown
                                            label="Équipe"
                                            disabled={isLoading}
                                            multiSelect
                                            options={[...this.props.param?.teams]?.map(x => { return { key: x.id, text: x.label } })}
                                            selectedKeys={this.state.searchParms.teamsId}
                                            onChange={(ev, item) => {
                                                const newSelectedItems = [...this.state.searchParms.teamsId]
                                                if (item.selected) {
                                                    newSelectedItems.push(item.key)
                                                } else {
                                                    const currIndex = newSelectedItems.indexOf(item.key)
                                                    if (currIndex > -1) newSelectedItems.splice(currIndex, 1)
                                                }
                                                this.setState({ searchParms: { ...this.state.searchParms, teamsId: newSelectedItems } })
                                            }}
                                        />
                                    </Columns.Column>
                                    <Columns.Column size="one-quarter">
                                        <Label>&#8203;</Label>
                                        <DefaultButton
                                            text="Rechercher"
                                            primary={true}
                                            split={true}
                                            disabled={isLoading}
                                            onClick={() => this.searchMembers()}
                                            menuProps={
                                                {
                                                    items: [
                                                        {
                                                            key: 'Clear',
                                                            text: 'Effacer les filtres',
                                                            iconProps: { iconName: 'ClearFilter' },
                                                            onClick: () => this.setState({
                                                                searchParms: {
                                                                    name: '',
                                                                    stepsId: [],
                                                                    teamsId: []
                                                                }
                                                            }, () => this.searchMembers())
                                                        }
                                                    ]
                                                }

                                            }
                                        />
                                    </Columns.Column>
                                </Columns>
                            </form>
                            <Separator >
                                <Icon iconName="ChevronDown" />
                            </Separator>
                            <br />
                        </>
                    }

                    <ShimmeredDetailsList
                        items={this.state.items}
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
                            // {
                            //     key: 'email',
                            //     name: 'Email',
                            //     fieldName: 'email',
                            //     minWidth: 70,
                            //     maxWidth: 200,
                            //     isResizable: true,
                            // },
                            // {
                            //     key: 'phone_number',
                            //     name: 'Téléphone',
                            //     fieldName: 'phone_number',
                            //     minWidth: 70,
                            //     maxWidth: 200,
                            //     isResizable: true,
                            // },
                            {
                                key: 'step',
                                name: 'Étape',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                                onRender: member => <>{getWf(member)}</>
                            },
                            {
                                key: 'team',
                                name: 'Équipe',
                                minWidth: 70,
                                maxWidth: 200,
                                isResizable: true,
                                onRender: member => <>{member.team?.label}</>
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                        enableShimmer={this.state.isLoading}
                        listProps={{ renderedWindowsAhead: 0, renderedWindowsBehind: 0 }}
                    />
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
const MembersAll = connect(mapStateToProps, mapDispatchToProps)(_MembersAll)
export default MembersAll
