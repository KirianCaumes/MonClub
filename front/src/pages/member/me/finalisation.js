import React from 'react'
import { Separator, Text } from 'office-ui-fabric-react'
import { connect } from 'react-redux'

class _MembersMeFinalisation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <section id="members-me-finalisation">
                <Text variant="large" block>Votre inscription a bien été prise en compte !</Text>
                <Separator />
                <Text>Votre inscription et votre paiement ont bien été pris en compte. Vous recevrez, apres confirmation du club de vos informations, un mail vous confirmant votre inscription au THBC.</Text>
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