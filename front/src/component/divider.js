import React from 'react'
import PropTypes from 'prop-types'

export default class Divider extends React.PureComponent {
    static propTypes = {
        /** Style */
        style: PropTypes.object,
    }

    static defaultProps = {
        style: {},
    }
    
    render() {
        const { style } = this.props
        return (
            <div className="divider" style={style}>
                <span></span>
            </div>
        )
    }
}