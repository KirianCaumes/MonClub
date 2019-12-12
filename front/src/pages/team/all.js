import React from 'react'
import { } from 'react-bulma-components'
import { ShimmeredDetailsList, MessageBarType, SelectionMode, Text } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import request from '../../helper/request'

class _TeamsAll extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            items: []
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Équipe', key: 'teams' },
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
                    this.props.setMessageBar(true, MessageBarType.error, err.toString())
                })
                .finally(() => this.setState({ isLoading: false }))
        })
    }

    render() {
        return (
            <section id="team-all">
                <div className="card" >
                    {
                        this.state.items.length === 0 && !this.state.isLoading ?
                            <Text variant="large" className="has-text-centered" block>Aucun résultat</Text> :
                            <ShimmeredDetailsList
                                items={this.state.items}
                                onActiveItemChanged={item => history.push(`/equipe/${item.id}`)}
                                columns={[
                                    {
                                        key: 'label',
                                        name: 'Label',
                                        fieldName: 'label',
                                        minWidth: 70,
                                        maxWidth: 200,
                                        isResizable: true,
                                    }
                                ]}
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
const TeamsAll = connect(mapStateToProps, mapDispatchToProps)(_TeamsAll)
export default TeamsAll
