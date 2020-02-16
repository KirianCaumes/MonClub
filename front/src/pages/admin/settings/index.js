import React from 'react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from 'redux/actions/common'
import { Columns } from 'react-bulma-components'
import { Text, Icon, PrimaryButton } from 'office-ui-fabric-react'
import Divider from 'component/divider'
import { history } from 'helper/history'

class _SettingsIndex extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
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
        return (
            <section id="admin-settings">
                <Columns>
                    <Columns.Column>
                        <div className="card" >
                            <Text variant="large" block><Icon iconName='Money' /> Tarifs</Text>
                            <Divider />
                            <PrimaryButton
                                text="Voir plus"
                                iconProps={{ iconName: 'RedEye' }}
                                onClick={() => history.push('/parametres/tarif')}
                            />
                        </div>
                    </Columns.Column>                    
                    <Columns.Column>
                        <div className="card" >
                            <Text variant="large" block><Icon iconName='WebAppBuilderFragment' /> Général</Text>
                            <Divider />
                            <PrimaryButton
                                text="Voir plus"
                                iconProps={{ iconName: 'RedEye' }}
                                onClick={() => history.push('/parametres/general')}
                            />
                        </div>
                    </Columns.Column>
                </Columns>
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
const SettingsIndex = connect(mapStateToProps, mapDispatchToProps)(_SettingsIndex)
export default SettingsIndex
