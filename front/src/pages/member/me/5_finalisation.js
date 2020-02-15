import React from 'react'
import { Text, Icon } from 'office-ui-fabric-react'
import { connect } from 'react-redux'
import Divider from 'component/divider'

class _MembersMeFinalisation extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <section id="members-me-finalisation">
                <Text variant="large" block><Icon iconName='Like' /> Votre inscription a bien été prise en compte !</Text>
                <Divider />
                <Text>
                    Votre inscription et votre paiement ont bien été pris en compte.
                    <br /><br />
                     Vous recevrez, apres confirmation du club de vos informations, un mail vous confirmant votre inscription au THBC.
                </Text>
            </section >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

const mapStateToProps = state => {
    return {}
}
const MembersMeFinalisation = connect(mapStateToProps, mapDispatchToProps)(_MembersMeFinalisation)
export default MembersMeFinalisation
