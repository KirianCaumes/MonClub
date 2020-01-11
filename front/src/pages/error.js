import React from 'react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand } from 'redux/actions/common'

class _Error extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.props.setBreadcrumb([])
        this.props.setCommand([])
    }
    render() {
        return (
            <section id="erreur">
                La page n'a pas été trouvée <span role="img" aria-label="sob">😭</span>
            </section>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setBreadcrumb: data => dispatch(setBreadcrumb(data)),
        setCommand: data => dispatch(setCommand(data))
    }
}

const mapStateToProps = state => {
    return {
        me: state.user.me
    }
}
const Error = connect(mapStateToProps, mapDispatchToProps)(_Error)
export default Error
