import React from 'react'
import { } from 'react-bulma-components'
import { } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import { PrintJson } from '../../component/printJson'

class _Constants extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.props.setBreadcrumb([
            { text: 'Administration', key: 'administration' },
            { text: 'Les constantes', key: 'constants', isCurrentItem: true },
        ])
        this.props.setCommand([])
    }

    render() {
        return (
            <section>
                <div className="card" >
                    <PrintJson data={this.props.param} />
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
const Constants = connect(mapStateToProps, mapDispatchToProps)(_Constants)
export default Constants
