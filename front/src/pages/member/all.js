import React from 'react'
import { Hero, Container, Heading, Columns } from 'react-bulma-components'
import { Text, Icon, ShimmeredDetailsList, MessageBarType, SelectionMode } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import '../../style/page/member/all.scss'
import request from '../../helper/request'

class _MembersAll extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            items: []
        }
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Tous les membres', key: 'all-members', onClick: () => history.push('/membres') },
        ])
        this.props.setCommand([
            {
                key: 'newItem',
                text: 'New',
                iconProps: { iconName: 'Add' },
                onClick: () => console.log('Calendar')
            },
            {
                key: 'upload',
                text: 'Upload',
                iconProps: { iconName: 'Upload' },
                onClick: () => console.log('Upload')
            },
            {
                key: 'share',
                text: 'Share',
                iconProps: { iconName: 'Share' },
                onClick: () => console.log('Share')
            },
            {
                key: 'download',
                text: 'Download',
                iconProps: { iconName: 'Download' },
                onClick: () => console.log('Download')
            }
        ])

        this.setState({ isLoading: true }, () => {
            request.getAllMembers()
                .then(data => this.setState({ items: data }))
                .catch(err => {
                    this.props.setMessageBar(true, MessageBarType.error, err.toString())
                })
                .finally(() => this.setState({ isLoading: false }))
        })
    }
    render() {
        return (
            <section id="members-all">
                <div className="card">
                    <ShimmeredDetailsList
                        items={this.state.items}
                        columns={[
                            {
                                key: 'firstname',
                                name: 'Prénom',
                                fieldName: 'firstname',
                                minWidth: 16,
                                maxWidth: 16,
                                // onColumnClick: this._onColumnClick,
                            }
                        ]}
                        selectionMode={SelectionMode.none}
                        // onRenderItemColumn={this._onRenderItemColumn}
                        enableShimmer={this.state.isLoading}
                        listProps={{ renderedWindowsAhead: 0, renderedWindowsBehind: 0 }}
                    />
                </div>
            </section>
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
        me: state.user.me
    }
}
const MembersAll = connect(mapStateToProps, mapDispatchToProps)(_MembersAll)
export default MembersAll
