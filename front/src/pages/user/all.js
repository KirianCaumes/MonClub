import React from 'react'
import { } from 'react-bulma-components'
import { ShimmeredDetailsList, MessageBarType, SelectionMode, Text } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import request from '../../helper/request'
import ParentPage from '../_parentPage'

class _UsersAll extends ParentPage {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            items: [],
            columns: [
                {
                    key: 'username',
                    name: 'Nom',
                    fieldName: 'username',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    isSorted: true,
                    isSortedDescending: false
                },
                {
                    key: 'enabled',
                    name: 'Activé',
                    fieldName: 'enabled',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: user => <>{user.enabled ? 'Oui' : 'Non'}</>
                },
                {
                    key: 'roles',
                    name: 'Roles',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: user => <>{user.roles?.join(', ')}</>
                }
            ]
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Administration', key: 'administration' },
            { text: 'Les comptes', key: 'users', isCurrentItem: true },
        ])

        this.props.setCommand([])

        this.setState({ isLoading: true }, () => {
            request.getAllUsers()
                .then(data => this.setState({ items: data }))
                .catch(err => {
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
                .finally(() => this.setState({ isLoading: false }))
        })
    }

    render() {
        return (
            <section id="user-all">
                <div className="card" >
                    {
                        this.state.items.length === 0 && !this.state.isLoading ?
                            <Text variant="large" className="has-text-centered" block>Aucun résultat</Text> :
                            <ShimmeredDetailsList
                                items={this.state.items}
                                onActiveItemChanged={item => history.push(`/utilisateur/${item.id}`)}
                                onColumnHeaderClick={this._onColumnClick.bind(this, { colName: "columns", dataName: ['items'], source: "state", action: "", exclude: ['roles'] })}
                                columns={this.state.columns}
                                selectionMode={SelectionMode.none}
                                enableShimmer={this.state.isLoading}
                            />
                    }
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
