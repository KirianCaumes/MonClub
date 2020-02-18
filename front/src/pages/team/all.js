import React from 'react'
import { } from 'react-bulma-components'
import { ShimmeredDetailsList, MessageBarType, SelectionMode, Text, Icon } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { history } from 'helper/history'
import request from 'helper/request'
import ParentPage from 'pages/_parentPage'

class _TeamsAll extends ParentPage {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            items: [],
            columns: [
                {
                    key: 'label',
                    name: 'Label',
                    fieldName: 'label',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    isSorted: true,
                    isSortedDescending: false,
                    onRender: team => <span className="is-capitalized">{team.label}</span>
                },
                {
                    key: 'label_google_contact',
                    name: 'Label Google Contact',
                    fieldName: 'label_google_contact',
                    minWidth: 70,
                    maxWidth: 200,
                    isResizable: true,
                    onRender: team => <span className="is-capitalized">{team.label_google_contact}</span>
                }
            ]
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Membres', key: 'members' },
            { text: 'Toutes les équipes', key: 'all-teams', isCurrentItem: true },
        ])

        this.props.setCommand([
            {
                key: 'newItem',
                text: 'Nouveau',
                iconProps: { iconName: 'Add' },
                onClick: () => history.push('/equipe/nouveau')
            },
        ])

        this.setState({ isLoading: true }, () => {
            request.getAllTeams()
                .then(data => this.setState({ items: data }))
                .catch(err => {
                    this.props.setMessageBar(true, MessageBarType.error, err)
                })
                .finally(() => this.setState({ isLoading: false }))
        })
    }

    render() {
        return (
            <section id="team-all">
                <div className="card" >
                    <div className="head">
                        <h1><Icon iconName='Teamwork' /> Rechercher parmis l'ensemble des équipes</h1>
                    </div>
                    <ShimmeredDetailsList
                        items={this.state.items}
                        onActiveItemChanged={item => history.push(`/equipe/${item.id}`)}
                        onColumnHeaderClick={this._onColumnClick.bind(this, { colName: "columns", dataName: ['items'], source: "state", action: "", exclude: [] })}
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
const TeamsAll = connect(mapStateToProps, mapDispatchToProps)(_TeamsAll)
export default TeamsAll
