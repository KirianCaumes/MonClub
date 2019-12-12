import React from 'react'
import { } from 'react-bulma-components'
import { } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { history } from '../../helper/history'
import { PrintJson } from '../../component/printJson'

class _MembersOne extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {      
        this.props.setBreadcrumb([
            { text: 'Membres', key: 'members' },
            { text: `${this.props.data?.firstname ?? ''} ${this.props.data?.lastname ?? ''}`, key: 'all-members', isCurrentItem: true },
        ])
        this.props.setCommand([])
    }

    render() {
        const { data } = this.props
        return (
            <section id="members-one">
                <div className="card" >
                    <PrintJson data={data} />
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
const MembersOne = connect(mapStateToProps, mapDispatchToProps)(_MembersOne)
export default MembersOne
