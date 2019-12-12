import React from 'react'
import { } from 'react-bulma-components'
import { } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import { setBreadcrumb, setCommand, setMessageBar } from '../../redux/actions/common'
import { PrintJson } from '../../component/printJson'
import { history } from '../../helper/history'

class _TeamOne extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {      
        this.props.setBreadcrumb([            
            { text: 'Équipe', key: 'teams' },
            { text: 'Toutes les équipes', key: 'all-teams', onClick: () => history.push('/equipes') },
            { text: `${this.props.data?.label ?? ''}`, key: 'teamOne', isCurrentItem: true },
        ])
        this.props.setCommand([])
    }

    render() {
        const { data } = this.props
        return (
            <section id="team-one">
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
const TeamOne = connect(mapStateToProps, mapDispatchToProps)(_TeamOne)
export default TeamOne
