import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'office-ui-fabric-react'

export default class FullLoader extends React.PureComponent {    
    static propTypes = {
        /** Is app loading ? */ 
        isLoading: PropTypes.bool,
    }

    static defaultProps = {
        isLoading: false,
    }

    render() {
        return (
            <div className={`pageloader ${this.props.isLoading ? 'is-active' : ''}`} style={{ transition: this.props.isLoading ? 'none' : '' }}>
                <span className="title"><Text>Chargement</Text></span>
            </div>
        )
    }
}